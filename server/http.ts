const UNAVAILABLE = 'Serviço temporariamente indisponível';

export function json(status: number, body: unknown, headers?: HeadersInit): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

export function fail(status: number, message: string, field?: string): Response {
  return json(status, field === undefined ? { message } : { message, field });
}

export function withErrors<Args extends unknown[]>(
  handler: (...args: Args) => Response | Promise<Response>,
): (...args: Args) => Promise<Response> {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error(error);
      return json(503, { message: UNAVAILABLE });
    }
  };
}
