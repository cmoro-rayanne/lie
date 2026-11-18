import { embedded } from '../src/content/embedded';
import { SiteContent } from '../src/content/schema';
import { SESSION_COOKIE, SESSION_SECONDS, login, readCookie, verifySession } from './auth';
import { ContentService } from './content-service';
import { D1AttemptsRepo, D1ContentRepo, DeployHookPublisher } from './d1-repo';
import { IMAGE_KEY, checkImage, imagesInUse, newImageKey } from './images';

export interface Env {
  DB: D1Database;
  IMAGENS: R2Bucket;
  ASSETS: Fetcher;
  /** Senha do painel (secret). */
  ADMIN_PASSWORD?: string;
  /** URL do Deploy Hook do Workers Builds (secret). */
  DEPLOY_HOOK_URL?: string;
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extra } });
}

const erro = (status: number, mensagem: string, extra: Record<string, unknown> = {}) =>
  json({ erro: mensagem, ...extra }, status);

function sessionCookie(value: string, maxAge: number): string {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  return !origin || origin === new URL(req.url).origin;
}

function service(env: Env): ContentService {
  return new ContentService(
    new D1ContentRepo(env.DB),
    new DeployHookPublisher(env.DEPLOY_HOOK_URL),
    SiteContent.parse(embedded),
  );
}

async function handle(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // --- Públicas ---
  if (method === 'GET' && path === '/api/public/site') {
    return json(await service(env).getPublished());
  }
  if ((method === 'GET' || method === 'HEAD') && path.startsWith('/img/')) {
    const key = path.slice(5);
    if (!IMAGE_KEY.test(key)) return new Response('Não encontrado', { status: 404 });
    const obj = await env.IMAGENS.get(key);
    if (!obj) return new Response('Não encontrado', { status: 404 });
    return new Response(method === 'HEAD' ? null : obj.body, {
      headers: {
        'content-type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
        'cache-control': 'public, max-age=31536000, immutable',
        'x-content-type-options': 'nosniff',
      },
    });
  }

  if (!path.startsWith('/api/')) return env.ASSETS.fetch(req);

  // Escritas só do próprio site (cookie é SameSite=Strict; isto é a segunda barreira).
  if (method !== 'GET' && !sameOrigin(req)) return erro(403, 'Origem não permitida.');

  const password = env.ADMIN_PASSWORD ?? '';

  if (method === 'POST' && path === '/api/login') {
    const body = (await req.json().catch(() => null)) as { senha?: unknown } | null;
    const given = typeof body?.senha === 'string' ? body.senha : '';
    const ip = req.headers.get('cf-connecting-ip') ?? 'desconhecido';
    const result = await login(new D1AttemptsRepo(env.DB), ip, given, password, Date.now());
    if (!result.ok) {
      return result.reason === 'bloqueado'
        ? erro(429, 'Muitas tentativas. Aguarde 15 minutos e tente de novo.')
        : erro(401, 'Senha incorreta.');
    }
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie(result.token, SESSION_SECONDS) });
  }
  if (method === 'POST' && path === '/api/logout') {
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
  }

  // --- Exigem sessão ---
  const token = readCookie(req.headers.get('cookie'), SESSION_COOKIE);
  if (!(await verifySession(token, password, Math.floor(Date.now() / 1000)))) {
    return erro(401, 'Entre com a senha para continuar.');
  }

  const svc = service(env);

  if (method === 'GET' && path === '/api/me') return json({ ok: true });
  if (method === 'GET' && path === '/api/content') return json(await svc.getDraft());

  if (method === 'PUT' && path === '/api/content') {
    const body = (await req.json().catch(() => null)) as {
      version?: unknown;
      content?: unknown;
    } | null;
    if (!body || typeof body.version !== 'number') return erro(400, 'Pedido inválido.');
    const r = await svc.saveDraft(body.content, body.version);
    if (r.ok) return json({ version: r.version });
    if (r.kind === 'conflito') {
      return erro(
        409,
        'O conteúdo foi alterado em outra aba. Recarregue a página para ver a versão mais recente.',
      );
    }
    return erro(422, 'Corrija os campos abaixo.', { detalhes: r.errors });
  }

  if (method === 'POST' && path === '/api/publish') {
    const body = (await req.json().catch(() => null)) as { version?: unknown } | null;
    if (!body || typeof body.version !== 'number') return erro(400, 'Pedido inválido.');
    const r = await svc.publish(body.version);
    if (!r.ok) return erro(409, 'O rascunho mudou. Recarregue a página e publique de novo.');
    return json({ publishedVersion: r.publishedVersion, buildTriggered: r.buildTriggered });
  }

  if (method === 'GET' && path === '/api/history') return json({ itens: await svc.history() });

  const restore = /^\/api\/restore\/(\d{1,9})$/.exec(path);
  if (method === 'POST' && restore) {
    const r = await svc.restore(Number(restore[1]));
    if (r.ok) return json({ version: r.version });
    return r.kind === 'inexistente'
      ? erro(404, 'Versão não encontrada.')
      : erro(409, 'O rascunho mudou. Recarregue a página.');
  }

  if (method === 'POST' && path === '/api/images') {
    const bytes = new Uint8Array(await req.arrayBuffer());
    const check = checkImage(req.headers.get('content-type'), bytes);
    if (!check.ok) return erro(415, check.error);
    const key = newImageKey(check.ext);
    await env.IMAGENS.put(key, bytes, {
      httpMetadata: { contentType: req.headers.get('content-type')!.split(';')[0]! },
    });
    return json({ caminho: `/img/${key}` }, 201);
  }

  if (method === 'GET' && path === '/api/images') {
    const used = imagesInUse(await svc.rawContents());
    const itens: {
      arquivo: string;
      caminho: string;
      bytes: number;
      enviadaEm: string;
      emUso: boolean;
    }[] = [];
    let cursor: string | undefined;
    do {
      const page = await env.IMAGENS.list({ limit: 500, cursor });
      for (const o of page.objects) {
        if (!IMAGE_KEY.test(o.key)) continue;
        itens.push({
          arquivo: o.key,
          caminho: `/img/${o.key}`,
          bytes: o.size,
          enviadaEm: o.uploaded.toISOString(),
          emUso: used.has(o.key),
        });
      }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor && itens.length < 2000);
    itens.sort((a, b) => b.enviadaEm.localeCompare(a.enviadaEm));
    return json({ itens });
  }

  const image = /^\/api\/images\/([^/]+)$/.exec(path);
  if (method === 'DELETE' && image) {
    const key = image[1]!;
    if (!IMAGE_KEY.test(key)) return erro(404, 'Imagem não encontrada.');
    if (imagesInUse(await svc.rawContents()).has(key)) {
      return erro(
        409,
        'Esta imagem está em uso no site ou no rascunho. Tire ela de onde aparece, salve e publique antes de apagar.',
      );
    }
    await env.IMAGENS.delete(key);
    return json({ ok: true });
  }

  return erro(404, 'Rota não encontrada.');
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      return await handle(req, env);
    } catch (e) {
      console.error('[painel] erro', e instanceof Error ? e.message : e);
      return erro(500, 'Algo deu errado. Tente de novo em instantes.');
    }
  },
} satisfies ExportedHandler<Env>;
