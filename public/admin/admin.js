/* Painel de conteúdo do site (docs/specs/0001-painel-conteudo.md e 0002-conta-e-senha.md). Sem dependências. Limites iguais aos de src/content/schema.ts. */
(() => {
  'use strict';

  const app = document.getElementById('app');
  const TABS = [
    ['inicio', 'Início'],
    ['sobre', 'Sobre'],
    ['abordagem', 'Abordagem'],
    ['grupos', 'Grupos'],
    ['atuacao', 'Atuação'],
    ['projetos', 'Projetos'],
    ['contato', 'Contato'],
    ['fotos', 'Fotos'],
    ['versoes', 'Versões'],
    ['conta', 'Minha conta'],
  ];

  const s = {
    content: null,
    version: 0,
    unpublished: false,
    publishedAt: '',
    dirty: false,
    tab: 'inicio',
    aviso: null, // { tipo: 'erro'|'ok'|'atencao', texto, detalhes?, recarregar? }
    busy: false,
    history: null,
    openCard: null,
    originais: {}, // fotos originais do site, por seção
  };

  // ---------- utilidades ----------
  function el(tag, props, ...children) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (k === 'value') n.value = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat(Infinity)) {
      if (c === null || c === undefined || c === false) continue;
      n.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return n;
  }

  function troca(no, ...filhos) {
    no.replaceChildren(
      ...filhos.flat().filter((c) => c !== null && c !== undefined && c !== false),
    );
  }

  const fmtData = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  async function api(method, path, body, raw) {
    const res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: raw
        ? { 'content-type': raw.type }
        : body
          ? { 'content-type': 'application/json' }
          : {},
      body: raw ? raw.blob : body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* resposta sem corpo */
    }
    if (res.status === 401 && path !== '/api/login' && path !== '/api/me') {
      renderLogin('Sua sessão expirou. Entre de novo.');
      throw Object.assign(new Error('sessão'), { handled: true });
    }
    return { status: res.status, ok: res.ok, data: data || {} };
  }

  function markDirty() {
    if (!s.dirty) {
      s.dirty = true;
      s.unpublished = true;
      updateBar();
    }
  }

  window.addEventListener('beforeunload', (e) => {
    if (s.dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // ---------- campos ----------
  function campo(obj, key, rotulo, { max, multi, ajuda, type = 'text', opcional, onchange } = {}) {
    const id = 'c' + Math.random().toString(36).slice(2, 9);
    const input = el(multi ? 'textarea' : 'input', {
      id,
      type: multi ? undefined : type,
      maxlength: max,
      value: obj[key] ?? '',
      autocomplete: 'off',
    });
    const contador = max ? el('span', { class: 'campo__contador' }) : null;
    const atualiza = () => {
      if (!contador) return;
      const n = input.value.length;
      contador.textContent = `${n}/${max}`;
      contador.className = 'campo__contador' + (n >= max ? ' campo__contador--cheio' : '');
    };
    input.addEventListener('input', () => {
      const v = input.value;
      if (opcional && v.trim() === '') delete obj[key];
      else obj[key] = v;
      atualiza();
      markDirty();
      if (onchange) onchange(v);
    });
    atualiza();
    return el(
      'div',
      { class: 'campo' },
      el(
        'label',
        { class: 'campo__rotulo', for: id },
        el('span', { text: rotulo + (opcional ? ' (opcional)' : '') }),
        contador,
      ),
      input,
      ajuda ? el('span', { class: 'campo__ajuda', text: ajuda }) : null,
    );
  }

  function mover(arr, i, d, rerender) {
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    markDirty();
    rerender();
  }

  function botoesItem(arr, i, rerender, remover = true) {
    return el(
      'span',
      { class: 'linha-item__botoes' },
      el('button', {
        type: 'button',
        class: 'btn btn--mini',
        title: 'Mover para cima',
        'aria-label': 'Mover para cima',
        disabled: i === 0,
        onclick: () => mover(arr, i, -1, rerender),
        text: '↑',
      }),
      el('button', {
        type: 'button',
        class: 'btn btn--mini',
        title: 'Mover para baixo',
        'aria-label': 'Mover para baixo',
        disabled: i === arr.length - 1,
        onclick: () => mover(arr, i, 1, rerender),
        text: '↓',
      }),
      remover
        ? el('button', {
            type: 'button',
            class: 'btn btn--mini btn--perigo',
            title: 'Remover',
            'aria-label': 'Remover',
            onclick: () => {
              arr.splice(i, 1);
              markDirty();
              rerender();
            },
            text: '✕',
          })
        : null,
    );
  }

  function listaTextos(arr, rotulo, { maxItens, maxChars, adicionar, multi, item, minItens = 0 }) {
    const caixa = el('div');
    const desenha = () => {
      caixa.replaceChildren(
        el('div', { class: 'sub-titulo', text: rotulo }),
        el(
          'div',
          { class: 'lista' },
          arr.map((_, i) =>
            el(
              'div',
              { class: 'linha-item' + (multi ? ' linha-item--multi' : '') },
              campo(arr, i, `${item || rotulo} ${i + 1}`, { max: maxChars, multi }),
              botoesItem(arr, i, desenha, arr.length > minItens),
            ),
          ),
        ),
        arr.length < maxItens
          ? el('button', {
              type: 'button',
              class: 'btn btn--mini',
              text: adicionar,
              onclick: () => {
                arr.push('');
                markDirty();
                desenha();
              },
            })
          : el('span', { class: 'campo__ajuda', text: `Máximo de ${maxItens} itens.` }),
      );
    };
    desenha();
    return caixa;
  }

  function listaPares(
    arr,
    rotulo,
    { maxItens, minItens = 0, t, d, labelT, labelD, adicionar, multiD = true },
  ) {
    const caixa = el('div');
    const desenha = () => {
      caixa.replaceChildren(
        el('div', { class: 'sub-titulo', text: rotulo }),
        el(
          'div',
          { class: 'lista' },
          arr.map((p, i) =>
            el(
              'div',
              { class: 'par' },
              el('div', { class: 'par__topo' }, botoesItem(arr, i, desenha, arr.length > minItens)),
              campo(p, t.key, labelT, { max: t.max }),
              campo(p, d.key, labelD, { max: d.max, multi: multiD }),
            ),
          ),
        ),
        arr.length < maxItens
          ? el('button', {
              type: 'button',
              class: 'btn btn--mini',
              text: adicionar,
              onclick: () => {
                arr.push({ [t.key]: '', [d.key]: '' });
                markDirty();
                desenha();
              },
            })
          : el('span', { class: 'campo__ajuda', text: `Máximo de ${maxItens} itens.` }),
      );
    };
    desenha();
    return caixa;
  }

  function cartao(chave, titulo, pequeno, ...corpo) {
    const d = el('details', { class: 'cartao' });
    if (s.openCard === chave) d.setAttribute('open', '');
    d.addEventListener('toggle', () => {
      if (d.open) s.openCard = chave;
      else if (s.openCard === chave) s.openCard = null;
    });
    d.append(
      el('summary', null, el('span', { text: titulo }), el('small', { text: pequeno || '' })),
      el('div', { class: 'cartao__corpo' }, corpo),
    );
    return d;
  }

  // ---------- abas ----------
  const AJUDA_DESTAQUE =
    'Para destacar um trecho em itálico, coloque entre asteriscos: Uma escuta para a *sua totalidade*.';

  // Chamada acima do título, título (com destaque) e, se a seção tiver, subtítulo.
  function camposTitulo(sec, { destaque = true, subtitulo = true } = {}) {
    return [
      campo(sec, 'eyebrow', 'Chamada acima do título', {
        max: 40,
        ajuda: 'Texto pequeno, em maiúsculas, acima do título.',
      }),
      campo(sec, 'title', 'Título', { max: 100, ajuda: destaque ? AJUDA_DESTAQUE : undefined }),
      subtitulo ? campo(sec, 'subtitle', 'Subtítulo', { max: 160 }) : null,
    ];
  }

  const paragrafos = (arr) =>
    listaTextos(arr, 'Parágrafos', {
      maxItens: 5,
      minItens: 1,
      maxChars: 700,
      multi: true,
      adicionar: 'Adicionar parágrafo',
      item: 'Parágrafo',
    });

  // Foto de uma seção: sem envio, o site usa a foto original (prévia vinda de /admin/fotos-originais.json).
  function campoFoto(chave) {
    const foto = s.content.images[chave];
    return [
      el('div', { class: 'sub-titulo', text: 'Foto' }),
      campoImagem(foto, 'src', {
        alt: 'Foto atual desta seção',
        padrao: s.originais[chave],
        vazio: 'Em uso: a foto original do site',
        tirar: 'Voltar para a original',
      }),
      campo(foto, 'alt', 'Descrição da foto', {
        max: 160,
        ajuda: 'Lida em voz alta para quem não enxerga a imagem. Descreva o que aparece na foto.',
      }),
    ];
  }

  function abaInicio() {
    const h = s.content.hero;
    return el(
      'section',
      null,
      el('h2', { text: 'Início' }),
      el('p', {
        class: 'sub',
        text: 'O topo do site, a frase em destaque logo abaixo da seção Sobre e como o site aparece no Google.',
      }),
      el('div', { class: 'sub-titulo', text: 'Topo' }),
      campo(h, 'eyebrow', 'Chamada acima da frase', { max: 80 }),
      campo(h, 'title', 'Frase do topo, primeira linha', { max: 80 }),
      campo(h, 'titleItalic', 'Frase do topo, segunda linha (em itálico)', {
        max: 80,
        ajuda: 'As aspas fazem parte do texto: abra na primeira linha e feche na segunda.',
      }),
      campo(h, 'text', 'Texto de apoio', { max: 300, multi: true }),
      el('div', { class: 'sub-titulo', text: 'Frase em destaque' }),
      campo(s.content.quote, 'text', 'Frase', { max: 240, multi: true }),
      campo(s.content.quote, 'author', 'Assinatura', { max: 80 }),
      el('div', { class: 'sub-titulo', text: 'No Google e ao compartilhar o link' }),
      campo(s.content.seo, 'title', 'Título no Google', {
        max: 80,
        ajuda: 'O ideal é até 60 caracteres.',
      }),
      campo(s.content.seo, 'description', 'Descrição no Google', {
        max: 200,
        multi: true,
        ajuda: 'O Google costuma mostrar os primeiros 160 caracteres.',
      }),
    );
  }

  function abaSobre() {
    const a = s.content.about;
    return el(
      'section',
      null,
      el('h2', { text: 'Sobre' }),
      el('p', { class: 'sub', text: 'A apresentação da Eliana, com a foto ao lado.' }),
      camposTitulo(a),
      paragrafos(a.paragraphs),
      campoFoto('about'),
    );
  }

  function abaAbordagem() {
    const a = s.content.approach;
    return el(
      'section',
      null,
      el('h2', { text: 'Abordagem' }),
      el('p', {
        class: 'sub',
        text: 'O título da seção e os cartões que explicam a forma de trabalhar.',
      }),
      camposTitulo(a),
      listaPares(a.cards, 'Cartões', {
        maxItens: 6,
        minItens: 1,
        t: { key: 'title', max: 60 },
        d: { key: 'text', max: 400 },
        labelT: 'Título',
        labelD: 'Texto',
        adicionar: 'Adicionar cartão',
      }),
    );
  }

  function abaGrupos() {
    const g = s.content.groups;
    return el(
      'section',
      null,
      el('h2', { text: 'Grupos' }),
      el('p', { class: 'sub', text: 'A seção verde sobre os grupos terapêuticos.' }),
      camposTitulo(g),
      campo(g, 'text', 'Texto', { max: 700, multi: true }),
      campoFoto('groups'),
    );
  }

  function abaAtuacao() {
    const a = s.content.areas;
    const arr = a.items;
    const lista = el('div');
    const desenha = () => {
      troca(
        lista,
        el('div', { class: 'sub-titulo', text: 'Áreas' }),
        el('p', {
          class: 'campo__ajuda',
          text: 'Cada área vira um cartão numerado. O texto completo aparece quando a pessoa toca em “Saiba mais”. Toque para abrir e editar.',
        }),
        arr.map((it, i) => {
          const key = 'ar' + (it._id ??= Math.random().toString(36).slice(2));
          const d = el('details', { class: 'cartao' });
          if (s.openCard === key) d.setAttribute('open', '');
          d.addEventListener('toggle', () => {
            if (d.open) s.openCard = key;
            else if (s.openCard === key) s.openCard = null;
          });
          const titulo = el('span', { text: it.title || 'Nova área' });
          d.append(
            el('summary', null, titulo, el('small', { text: String(i + 1).padStart(2, '0') })),
            el(
              'div',
              { class: 'cartao__corpo' },
              el(
                'div',
                { class: 'grade grade--2' },
                campo(it, 'title', 'Nome da área', {
                  max: 60,
                  onchange: (v) => {
                    titulo.textContent = v || 'Nova área';
                  },
                }),
                campo(it, 'subtitle', 'Linha abaixo do nome', { max: 80 }),
              ),
              campo(it, 'lead', 'Resumo (aparece no cartão)', { max: 300, multi: true }),
              campo(it, 'body', 'Texto completo (aparece em “Saiba mais”)', {
                max: 500,
                multi: true,
              }),
              el(
                'div',
                { class: 'cartao__acoes' },
                el('button', {
                  type: 'button',
                  class: 'btn btn--mini',
                  disabled: i === 0,
                  text: 'Subir',
                  onclick: () => mover(arr, i, -1, desenha),
                }),
                el('button', {
                  type: 'button',
                  class: 'btn btn--mini',
                  disabled: i === arr.length - 1,
                  text: 'Descer',
                  onclick: () => mover(arr, i, 1, desenha),
                }),
                el('button', {
                  type: 'button',
                  class: 'btn btn--mini btn--perigo',
                  text: 'Remover área',
                  disabled: arr.length <= 1,
                  onclick: () => {
                    if (
                      !confirm(
                        `Remover a área “${it.title || 'sem nome'}”? Ela sai do site quando você publicar.`,
                      )
                    )
                      return;
                    arr.splice(i, 1);
                    markDirty();
                    desenha();
                  },
                }),
              ),
            ),
          );
          return d;
        }),
        arr.length < 6
          ? el('button', {
              type: 'button',
              class: 'btn',
              text: 'Adicionar área',
              onclick: () => {
                const n = { title: '', subtitle: '', lead: '', body: '' };
                arr.push(n);
                s.openCard = 'ar' + (n._id = Math.random().toString(36).slice(2));
                markDirty();
                desenha();
              },
            })
          : el('p', { class: 'campo__ajuda', text: 'Máximo de 6 áreas.' }),
      );
    };
    desenha();
    return el(
      'section',
      null,
      el('h2', { text: 'Atuação' }),
      el('p', { class: 'sub', text: 'As áreas de atuação e o texto de cada uma.' }),
      camposTitulo(a, { subtitulo: false }),
      lista,
    );
  }

  function abaProjetos() {
    const p = s.content.projects;
    return el(
      'section',
      null,
      el('h2', { text: 'Projetos' }),
      el('p', { class: 'sub', text: 'A seção dos projetos criativos, com a foto ao lado.' }),
      camposTitulo(p),
      paragrafos(p.paragraphs),
      campoFoto('projects'),
    );
  }

  function abaContato() {
    const c = s.content.contact;
    const f = s.content.footer;
    return el(
      'section',
      null,
      el('h2', { text: 'Contato' }),
      el('p', {
        class: 'sub',
        text: 'Telefone, e-mail e endereço, a chamada para o WhatsApp, o formulário e o rodapé. Toque para abrir e editar.',
      }),
      cartao(
        'ct-dados',
        'Dados de contato',
        'usados em todo o site',
        el(
          'div',
          { class: 'grade grade--2' },
          campo(c, 'whatsapp', 'WhatsApp (só números, com 55 e DDD)', {
            max: 13,
            ajuda: 'Ex.: 5548999212332. É o número que recebe as mensagens do site.',
          }),
          campo(c, 'phoneDisplay', 'Telefone como aparece no site', {
            max: 30,
            ajuda: 'Ex.: (48) 99921-2332',
          }),
          campo(c, 'email', 'E-mail', { type: 'email', max: 120 }),
          campo(c, 'instagram', 'Instagram', {
            type: 'url',
            max: 300,
            ajuda: 'Link completo, com https://',
          }),
        ),
        campo(c, 'address', 'Endereço do consultório', { max: 200, multi: true }),
      ),
      cartao(
        'ct-chamada',
        'Chamada para o WhatsApp',
        'faixa verde antes do formulário',
        camposTitulo(s.content.cta, { destaque: false, subtitulo: false }),
        campo(s.content.cta, 'text', 'Texto', { max: 240, multi: true }),
        campoFoto('cta'),
      ),
      cartao(
        'ct-form',
        'Seção de contato e formulário',
        'no fim da página',
        camposTitulo(c, { destaque: false, subtitulo: false }),
        campo(c, 'intro', 'Introdução', { max: 300, multi: true }),
        campo(c, 'waGreeting', 'Primeira linha da mensagem enviada pelo formulário', {
          max: 120,
          ajuda: 'O formulário abre o WhatsApp com esta saudação, seguida dos dados preenchidos.',
        }),
        listaTextos(c.subjects, 'Assuntos do formulário', {
          maxItens: 10,
          minItens: 1,
          maxChars: 60,
          adicionar: 'Adicionar assunto',
          item: 'Assunto',
        }),
      ),
      cartao(
        'ct-rodape',
        'Rodapé',
        'parte escura no fim do site',
        campo(f, 'quote', 'Frase no alto do rodapé', { max: 300, multi: true }),
        campo(f, 'tagline', 'Texto abaixo da logo', { max: 240, multi: true }),
        campo(f, 'copyright', 'Linha final', {
          max: 120,
          ajuda: 'Aparece depois de “© ” e do ano, que muda sozinho.',
        }),
      ),
    );
  }

  const FORMATOS = {
    foto: {
      max: 1600,
      tipos: [
        ['image/webp', 0.82],
        ['image/webp', 0.6],
        ['image/jpeg', 0.7],
      ],
    },
  };

  // Reduz a imagem no navegador antes de enviar (limite do servidor: 2 MB).
  async function prepararImagem(file, formato = 'foto') {
    const f = FORMATOS[formato];
    const bmp = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (f.corte) {
      const [w, h] = f.corte;
      canvas.width = w;
      canvas.height = h;
      const escala = Math.max(w / bmp.width, h / bmp.height);
      const lw = bmp.width * escala;
      const lh = bmp.height * escala;
      ctx.fillStyle = f.fundo;
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(bmp, (w - lw) / 2, (h - lh) / 2, lw, lh);
    } else {
      const escala = Math.min(1, f.max / bmp.width);
      canvas.width = Math.round(bmp.width * escala);
      canvas.height = Math.round(bmp.height * escala);
      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    }
    for (const [type, q] of f.tipos) {
      const blob = await new Promise((r) => canvas.toBlob(r, type, q));
      if (blob && blob.type === type && blob.size <= 2 * 1024 * 1024) return { blob, type };
    }
    throw new Error('Não consegui reduzir a imagem para menos de 2 MB. Tente uma imagem menor.');
  }

  // Bloco de imagem: mostra a atual, envia outra ou tira. `obj[key]` guarda o caminho (/img/...).
  function campoImagem(
    obj,
    key,
    {
      formato = 'foto',
      alt,
      vazio,
      padrao,
      enviar = 'Enviar foto',
      trocar = 'Trocar foto',
      tirar = 'Tirar foto',
      classe = '',
    },
  ) {
    const caixa = el('div', { class: 'foto ' + classe });
    const pinta = () => {
      const atual = obj[key] || padrao;
      caixa.replaceChildren(
        atual ? el('img', { src: atual, alt }) : el('div', { class: 'foto__vazio', text: vazio }),
        el(
          'div',
          null,
          el(
            'label',
            { class: 'btn btn--mini', style: 'cursor:pointer;display:inline-block' },
            obj[key] ? trocar : enviar,
            el('input', {
              type: 'file',
              accept: 'image/png,image/jpeg,image/webp',
              style: 'display:none',
              onchange: async (ev) => {
                const f = ev.target.files[0];
                if (!f) return;
                s.aviso = { tipo: 'atencao', texto: 'Enviando a imagem…' };
                renderAviso();
                try {
                  const { blob, type } = await prepararImagem(f, formato);
                  const r = await api('POST', '/api/images', null, { blob, type });
                  if (!r.ok) throw new Error(r.data.erro || 'Não foi possível enviar a imagem.');
                  obj[key] = r.data.caminho;
                  markDirty();
                  s.aviso = { tipo: 'ok', texto: 'Imagem enviada. Salve o rascunho para guardar.' };
                  pinta();
                  renderAviso();
                } catch (e) {
                  if (!e.handled) {
                    s.aviso = {
                      tipo: 'erro',
                      texto: e.message || 'Não consegui ler esta imagem. Envie JPEG, PNG ou WebP.',
                    };
                    renderAviso();
                  }
                }
                ev.target.value = '';
              },
            }),
          ),
          obj[key]
            ? el('button', {
                type: 'button',
                class: 'btn btn--mini btn--perigo',
                style: 'margin-left:.4rem',
                text: tirar,
                onclick: () => {
                  delete obj[key];
                  markDirty();
                  pinta();
                },
              })
            : null,
          obj[key]
            ? null
            : padrao
              ? el('div', {
                  class: 'campo__ajuda',
                  style: 'margin-top:.4rem',
                  text: 'Em uso: a foto original do site.',
                })
              : null,
        ),
      );
    };
    pinta();
    return caixa;
  }

  const fmtTamanho = (b) =>
    b >= 1048576
      ? `${(b / 1048576).toFixed(1).replace('.', ',')} MB`
      : `${Math.max(1, Math.round(b / 1024))} KB`;

  function abaFotos() {
    const galeria = el('div', null, el('p', { text: 'Carregando…' }));
    const carregaGaleria = async () => {
      try {
        const r = await api('GET', '/api/images');
        if (!r.ok) throw new Error(r.data.erro || 'Não foi possível carregar as fotos.');
        const itens = r.data.itens || [];
        const soltas = itens.filter((i) => !i.emUso).length;
        galeria.replaceChildren(
          itens.length === 0
            ? el('div', {
                class: 'vazio',
                text: 'Nenhuma foto enviada ainda. O site está usando as fotos originais.',
              })
            : el('p', {
                class: 'campo__ajuda',
                text: `${itens.length} foto(s) guardada(s), ${soltas} sem uso. Só dá para apagar as que não aparecem no site nem no rascunho salvo.`,
              }),
          el(
            'ul',
            { class: 'galeria' },
            itens.map((it) =>
              el(
                'li',
                null,
                el(
                  'a',
                  { href: it.caminho, target: '_blank', rel: 'noopener' },
                  el('img', {
                    src: it.caminho,
                    alt: 'Foto enviada em ' + fmtData(it.enviadaEm),
                    loading: 'lazy',
                  }),
                ),
                el('span', {
                  class: 'galeria__info',
                  text: `${fmtData(it.enviadaEm)} · ${fmtTamanho(it.bytes)}`,
                }),
                it.emUso
                  ? el('span', { class: 'galeria__uso', text: 'Em uso' })
                  : el('button', {
                      type: 'button',
                      class: 'btn btn--mini btn--perigo',
                      text: 'Apagar',
                      onclick: async () => {
                        if (!confirm('Apagar esta foto de vez? Não dá para desfazer.')) return;
                        try {
                          const rr = await api('DELETE', '/api/images/' + it.arquivo);
                          s.aviso = rr.ok
                            ? { tipo: 'ok', texto: 'Foto apagada.' }
                            : { tipo: 'erro', texto: rr.data.erro || 'Não foi possível apagar.' };
                        } catch (e) {
                          if (e.handled) return;
                          s.aviso = { tipo: 'erro', texto: 'Sem conexão. Tente de novo.' };
                        }
                        renderAviso();
                        carregaGaleria();
                      },
                    }),
              ),
            ),
          ),
        );
      } catch (e) {
        if (!e.handled) galeria.replaceChildren(el('p', { text: e.message }));
      }
    };
    carregaGaleria();
    return el(
      'section',
      null,
      el('h2', { text: 'Fotos enviadas' }),
      el('p', {
        class: 'sub',
        text: 'Todas as fotos já enviadas pelo painel. Para trocar a foto de uma seção, use as abas Sobre, Grupos, Projetos e Contato.',
      }),
      galeria,
    );
  }

  // ---------- minha conta ----------
  // Campo solto (não faz parte do conteúdo do site, então não marca "alterações não salvas").
  function campoSolto(
    id,
    rotulo,
    { type = 'text', value = '', max, ajuda, autocomplete = 'off' } = {},
  ) {
    const input = el('input', { id, type, maxlength: max, value, autocomplete });
    const bloco = el(
      'div',
      { class: 'campo' },
      el('label', { class: 'campo__rotulo', for: id }, el('span', { text: rotulo })),
      input,
      ajuda ? el('span', { class: 'campo__ajuda', text: ajuda }) : null,
    );
    return { input, bloco };
  }

  const REGRA_SENHA = 'Ao menos 10 caracteres, com letras e números.';

  function abaConta() {
    const caixa = el(
      'section',
      null,
      el('h2', { text: 'Minha conta' }),
      el('p', { text: 'Carregando…' }),
    );
    const avisa = (tipo, texto) => {
      s.aviso = { tipo, texto };
      renderAviso();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const desenha = (conta) => {
      const nome = campoSolto('conta-nome', 'Seu nome', {
        value: conta.nome,
        max: 80,
        autocomplete: 'name',
      });
      const email = campoSolto('conta-email', 'E-mail de recuperação', {
        type: 'email',
        value: conta.email,
        max: 120,
        autocomplete: 'email',
        ajuda:
          'É para este e-mail que vai o link de “Esqueci minha senha”. Em branco, a recuperação fica desligada.',
      });
      const senhaDados = campoSolto('conta-senha-dados', 'Senha atual', {
        type: 'password',
        autocomplete: 'current-password',
        ajuda: 'Só é pedida quando você muda o e-mail de recuperação.',
      });
      const atual = campoSolto('conta-senha-atual', 'Senha atual', {
        type: 'password',
        autocomplete: 'current-password',
      });
      const nova = campoSolto('conta-senha-nova', 'Senha nova', {
        type: 'password',
        autocomplete: 'new-password',
        ajuda: REGRA_SENHA,
      });
      const repete = campoSolto('conta-senha-repete', 'Repita a senha nova', {
        type: 'password',
        autocomplete: 'new-password',
      });

      const salvarDados = el('button', {
        class: 'btn btn--principal',
        type: 'submit',
        text: 'Salvar dados',
      });
      const formDados = el(
        'form',
        {
          onsubmit: async (ev) => {
            ev.preventDefault();
            salvarDados.disabled = true;
            try {
              const r = await api('PUT', '/api/account', {
                nome: nome.input.value,
                email: email.input.value,
                senhaAtual: senhaDados.input.value,
              });
              if (r.ok) {
                s.aviso = { tipo: 'ok', texto: 'Dados da conta salvos.' };
                await carrega();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else avisa('erro', r.data.erro || 'Não foi possível salvar.');
            } catch (e) {
              if (!e.handled) avisa('erro', 'Sem conexão. Tente de novo.');
            }
            salvarDados.disabled = false;
          },
        },
        el('div', { class: 'grade grade--2' }, nome.bloco, email.bloco),
        senhaDados.bloco,
        salvarDados,
      );

      const trocar = el('button', {
        class: 'btn btn--principal',
        type: 'submit',
        text: 'Trocar senha',
      });
      const formSenha = el(
        'form',
        {
          onsubmit: async (ev) => {
            ev.preventDefault();
            if (nova.input.value !== repete.input.value)
              return avisa('erro', 'As duas senhas novas não são iguais.');
            trocar.disabled = true;
            try {
              const r = await api('PUT', '/api/account/password', {
                senhaAtual: atual.input.value,
                senhaNova: nova.input.value,
              });
              if (r.ok) {
                s.aviso = {
                  tipo: 'ok',
                  texto:
                    'Senha trocada. Outros aparelhos que estavam com o painel aberto precisam entrar de novo.',
                };
                await carrega();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else avisa('erro', r.data.erro || 'Não foi possível trocar a senha.');
            } catch (e) {
              if (!e.handled) avisa('erro', 'Sem conexão. Tente de novo.');
            }
            trocar.disabled = false;
          },
        },
        atual.bloco,
        el('div', { class: 'grade grade--2' }, nova.bloco, repete.bloco),
        trocar,
      );

      troca(
        caixa,
        el('h2', { text: 'Minha conta' }),
        el('p', {
          class: 'sub',
          text: 'Seus dados de acesso ao painel. O que você muda aqui vale na hora e não aparece no site.',
        }),
        conta.envioDeEmail
          ? null
          : el(
              'div',
              { class: 'aviso aviso--atencao' },
              el('strong', {
                text: 'O envio de e-mail ainda não foi configurado, então “Esqueci minha senha” não funciona. Avise o suporte.',
              }),
            ),
        el('div', { class: 'sub-titulo', text: 'Dados' }),
        formDados,
        el('div', { class: 'sub-titulo', text: 'Senha' }),
        conta.senhaPropria
          ? null
          : el('p', {
              class: 'campo__ajuda',
              text: 'Você ainda usa a senha inicial. Troque por uma senha só sua.',
            }),
        formSenha,
      );
      renderAviso();
    };
    const carrega = async () => {
      try {
        const r = await api('GET', '/api/account');
        if (!r.ok) throw new Error(r.data.erro || 'Não foi possível carregar a conta.');
        desenha(r.data);
      } catch (e) {
        if (!e.handled)
          troca(caixa, el('h2', { text: 'Minha conta' }), el('p', { text: e.message }));
      }
    };
    carrega();
    return caixa;
  }

  function abaVersoes() {
    const caixa = el(
      'section',
      null,
      el('h2', { text: 'Versões publicadas' }),
      el('p', {
        class: 'sub',
        text: 'Cada publicação fica guardada. Voltar uma versão copia o conteúdo para o rascunho; o site só muda quando você publicar.',
      }),
    );
    const lista = el('div', null, el('p', { text: 'Carregando…' }));
    caixa.append(lista);
    (async () => {
      try {
        const r = await api('GET', '/api/history');
        const itens = r.data.itens || [];
        lista.replaceChildren(
          itens.length === 0
            ? el('div', {
                class: 'vazio',
                text: 'Ainda não há publicações guardadas. A primeira aparece depois de você publicar.',
              })
            : el(
                'ul',
                { class: 'versoes' },
                itens.map((it, idx) =>
                  el(
                    'li',
                    null,
                    el('span', {
                      text: `Versão ${it.version} · ${fmtData(it.createdAt)}${idx === 0 ? ' · mais recente' : ''}`,
                    }),
                    el('button', {
                      type: 'button',
                      class: 'btn btn--mini',
                      text: 'Voltar para esta versão',
                      onclick: async () => {
                        if (
                          s.dirty &&
                          !confirm(
                            'Há alterações não salvas. Voltar uma versão substitui o rascunho. Continuar?',
                          )
                        )
                          return;
                        const rr = await api('POST', `/api/restore/${it.id}`);
                        if (!rr.ok) {
                          s.aviso = {
                            tipo: 'erro',
                            texto: rr.data.erro || 'Não foi possível voltar a versão.',
                          };
                          renderAviso();
                          return;
                        }
                        await carregar();
                        s.tab = 'inicio';
                        s.aviso = {
                          tipo: 'ok',
                          texto: `Versão ${it.version} copiada para o rascunho. Confira e clique em Publicar para colocar no site.`,
                        };
                        renderApp();
                      },
                    }),
                  ),
                ),
              ),
        );
      } catch (e) {
        if (!e.handled)
          lista.replaceChildren(el('p', { text: 'Não foi possível carregar as versões.' }));
      }
    })();
    return caixa;
  }

  // ---------- estrutura ----------
  function limpa(content) {
    // tira campos auxiliares da interface (_id) antes de enviar
    return JSON.parse(JSON.stringify(content, (k, v) => (k === '_id' ? undefined : v)));
  }

  async function carregar() {
    const r = await api('GET', '/api/content');
    if (!r.ok) throw new Error(r.data.erro || 'Não foi possível carregar o conteúdo.');
    s.content = r.data.content;
    s.version = r.data.version;
    s.unpublished = r.data.unpublished;
    s.publishedAt = r.data.publishedAt;
    s.dirty = false;
  }

  async function salvar() {
    const r = await api('PUT', '/api/content', { version: s.version, content: limpa(s.content) });
    if (r.ok) {
      s.version = r.data.version;
      s.dirty = false;
      return true;
    }
    s.aviso =
      r.status === 409
        ? { tipo: 'erro', texto: r.data.erro, recarregar: true }
        : {
            tipo: 'erro',
            texto: r.data.erro || 'Não foi possível salvar.',
            detalhes: r.data.detalhes,
          };
    return false;
  }

  async function aoSalvar() {
    if (s.busy) return;
    s.busy = true;
    updateBar();
    try {
      if (await salvar())
        s.aviso = {
          tipo: 'ok',
          texto: 'Rascunho salvo. O site ainda não mudou: clique em Publicar quando quiser.',
        };
    } catch (e) {
      if (!e.handled) s.aviso = { tipo: 'erro', texto: e.message };
    }
    s.busy = false;
    updateBar();
    renderAviso();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function aoPublicar() {
    if (s.busy) return;
    if (!confirm('Publicar agora? O site é atualizado em cerca de 1 a 2 minutos.')) return;
    s.busy = true;
    updateBar();
    try {
      if (s.dirty && !(await salvar())) {
        s.busy = false;
        updateBar();
        renderAviso();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const r = await api('POST', '/api/publish', { version: s.version });
      if (r.ok) {
        s.unpublished = false;
        s.aviso = r.data.buildTriggered
          ? {
              tipo: 'ok',
              texto:
                'Publicado! O site está sendo atualizado e as mudanças aparecem em 1 a 2 minutos.',
            }
          : {
              tipo: 'atencao',
              texto:
                'Publicado no painel, mas não consegui avisar o Cloudflare para atualizar o site. Clique em Publicar de novo; se repetir, avise o suporte.',
            };
      } else {
        s.aviso = {
          tipo: 'erro',
          texto: r.data.erro || 'Não foi possível publicar.',
          recarregar: r.status === 409,
        };
      }
    } catch (e) {
      if (!e.handled) s.aviso = { tipo: 'erro', texto: e.message };
    }
    s.busy = false;
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function aoSair() {
    if (s.dirty && !confirm('Há alterações não salvas. Sair mesmo assim?')) return;
    s.dirty = false;
    await api('POST', '/api/logout').catch(() => {});
    renderLogin();
  }

  const refs = {};

  function updateBar() {
    if (!refs.estado) return;
    refs.estado.className =
      'estado ' +
      (s.dirty ? 'estado--pendente' : s.unpublished ? 'estado--pendente' : 'estado--ok');
    refs.estado.textContent = s.dirty
      ? 'Alterações não salvas'
      : s.unpublished
        ? 'Rascunho salvo, ainda não publicado'
        : 'Site em dia com o painel';
    refs.salvar.disabled = s.busy || !s.dirty;
    refs.publicar.disabled = s.busy;
    refs.publicar.textContent = !s.dirty && !s.unpublished ? 'Publicar de novo' : 'Publicar';
  }

  function renderAviso() {
    if (!refs.aviso) return;
    const a = s.aviso;
    refs.aviso.replaceChildren();
    if (!a) return;
    refs.aviso.append(
      el(
        'div',
        { class: `aviso aviso--${a.tipo}`, role: a.tipo === 'erro' ? 'alert' : 'status' },
        el('strong', { text: a.texto }),
        a.detalhes && a.detalhes.length
          ? el(
              'ul',
              null,
              a.detalhes.map((d) => el('li', { text: d })),
            )
          : null,
        a.recarregar
          ? el(
              'div',
              null,
              el('button', {
                class: 'btn btn--mini',
                type: 'button',
                text: 'Recarregar a página',
                onclick: () => {
                  s.dirty = false;
                  location.reload();
                },
              }),
            )
          : null,
      ),
    );
  }

  function renderApp() {
    const conteudo = el('div');
    const abas = {
      inicio: abaInicio,
      sobre: abaSobre,
      abordagem: abaAbordagem,
      grupos: abaGrupos,
      atuacao: abaAtuacao,
      projetos: abaProjetos,
      contato: abaContato,
      fotos: abaFotos,
      versoes: abaVersoes,
      conta: abaConta,
    };
    conteudo.append(abas[s.tab]());
    refs.estado = el('span', { class: 'estado', 'aria-live': 'polite' });
    refs.salvar = el('button', {
      class: 'btn',
      type: 'button',
      text: 'Salvar rascunho',
      onclick: aoSalvar,
    });
    refs.publicar = el('button', {
      class: 'btn btn--principal',
      type: 'button',
      onclick: aoPublicar,
    });
    refs.aviso = el('div', { 'aria-live': 'polite' });
    app.replaceChildren(
      el(
        'header',
        { class: 'topo' },
        el(
          'div',
          { class: 'topo__linha' },
          el('div', { class: 'marca' }, 'Ilê', el('span', { text: ' · painel' })),
          refs.estado,
          el(
            'div',
            { class: 'acoes' },
            el('a', {
              class: 'btn',
              href: '/',
              target: '_blank',
              rel: 'noopener',
              text: 'Ver o site',
            }),
            refs.salvar,
            refs.publicar,
            el('button', { class: 'btn', type: 'button', text: 'Sair', onclick: aoSair }),
          ),
        ),
        el(
          'nav',
          { class: 'abas', role: 'tablist', 'aria-label': 'Seções' },
          TABS.map(([id, nome]) =>
            el('button', {
              class: 'aba',
              type: 'button',
              role: 'tab',
              'aria-selected': String(s.tab === id),
              text: nome,
              onclick: () => {
                s.tab = id;
                s.aviso = null;
                renderApp();
              },
            }),
          ),
        ),
      ),
      el('main', null, refs.aviso, conteudo),
    );
    updateBar();
    renderAviso();
  }

  // Tela simples fora do painel (entrar, esqueci a senha, redefinir).
  function telaDeEntrada(titulo, texto, campos, botaoTexto, aoEnviar, rodape) {
    refs.estado = null;
    const erro = el('p', { role: 'alert', class: 'entrar__erro' });
    const ok = el('p', { role: 'status', class: 'entrar__ok' });
    const botao = el('button', { class: 'btn btn--principal', type: 'submit', text: botaoTexto });
    const form = el(
      'form',
      {
        onsubmit: async (ev) => {
          ev.preventDefault();
          botao.disabled = true;
          erro.textContent = '';
          ok.textContent = '';
          try {
            await aoEnviar({ erro, ok, botao });
          } catch (e) {
            erro.textContent = 'Sem conexão. Tente de novo.';
          }
          botao.disabled = false;
        },
      },
      el('h1', { text: titulo }),
      el('p', { text: texto }),
      campos.map((c) => c.bloco),
      erro,
      ok,
      botao,
      rodape,
    );
    app.replaceChildren(el('div', { class: 'entrar' }, form));
    campos[0].input.focus();
    return { erro, ok };
  }

  const linkDeTela = (texto, aoClicar) =>
    el('button', { type: 'button', class: 'entrar__link', text: texto, onclick: aoClicar });

  function renderLogin(msg) {
    const senha = campoSolto('senha', 'Senha', {
      type: 'password',
      autocomplete: 'current-password',
    });
    senha.input.required = true;
    const { erro } = telaDeEntrada(
      'Painel Ilê',
      'Entre para editar o conteúdo do site.',
      [senha],
      'Entrar',
      async ({ erro }) => {
        const r = await api('POST', '/api/login', { senha: senha.input.value });
        if (!r.ok) {
          erro.textContent = r.data.erro || 'Não foi possível entrar.';
          senha.input.select();
          return;
        }
        await iniciar();
      },
      linkDeTela('Esqueci minha senha', () => renderEsqueci()),
    );
    erro.textContent = msg || '';
  }

  function renderEsqueci() {
    const email = campoSolto('email', 'E-mail de recuperação', {
      type: 'email',
      autocomplete: 'email',
      max: 120,
    });
    email.input.required = true;
    telaDeEntrada(
      'Esqueci minha senha',
      'Informe o e-mail de recuperação cadastrado em Minha conta. Enviamos um link para você escolher uma senha nova.',
      [email],
      'Enviar link',
      async ({ erro, ok }) => {
        const r = await api('POST', '/api/forgot', { email: email.input.value });
        if (r.ok) ok.textContent = r.data.mensagem;
        else erro.textContent = r.data.erro || 'Não foi possível enviar. Tente de novo.';
      },
      linkDeTela('Voltar para a entrada', () => renderLogin()),
    );
  }

  function renderRedefinir(token) {
    const nova = campoSolto('senha-nova', 'Senha nova', {
      type: 'password',
      autocomplete: 'new-password',
      ajuda: REGRA_SENHA,
    });
    const repete = campoSolto('senha-repete', 'Repita a senha nova', {
      type: 'password',
      autocomplete: 'new-password',
    });
    nova.input.required = true;
    repete.input.required = true;
    telaDeEntrada(
      'Escolha uma senha nova',
      'Depois de salvar, entre no painel com a senha nova.',
      [nova, repete],
      'Salvar senha nova',
      async ({ erro }) => {
        if (nova.input.value !== repete.input.value) {
          erro.textContent = 'As duas senhas não são iguais.';
          return;
        }
        const r = await api('POST', '/api/reset', { token, senhaNova: nova.input.value });
        if (!r.ok) {
          erro.textContent = r.data.erro || 'Não foi possível salvar a senha.';
          return;
        }
        renderLogin();
        document.querySelector('.entrar__ok').textContent = 'Senha nova salva. Entre com ela.';
      },
      linkDeTela('Voltar para a entrada', () => renderLogin()),
    );
  }

  // Link do e-mail: /admin/#redefinir=<token>. O token sai do endereço assim que é lido.
  function tokenDoLink() {
    const m = /^#redefinir=([a-f0-9]{64})$/.exec(location.hash);
    if (!m) return null;
    history.replaceState(null, '', location.pathname);
    return m[1];
  }

  async function iniciar() {
    const token = tokenDoLink();
    if (token) return renderRedefinir(token);
    try {
      const me = await api('GET', '/api/me');
      if (!me.ok) return renderLogin();
      await carregar();
      // Prévia das fotos originais; se faltar, o painel só deixa de mostrar a miniatura.
      s.originais = await fetch('/admin/fotos-originais.json')
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({}));
      s.aviso = null;
      renderApp();
    } catch (e) {
      if (!e.handled)
        app.replaceChildren(
          el('p', {
            class: 'carregando',
            text: e.message || 'Erro ao carregar. Recarregue a página.',
          }),
        );
    }
  }

  iniciar();
})();
