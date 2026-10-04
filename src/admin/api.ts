const GENERIC_ERROR = 'Não foi possível concluir. Tente novamente.';

export class ApiError extends Error {
  readonly status: number;
  readonly field: string | undefined;

  constructor(status: number, message: string, field?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.field = field;
  }
}

function readError(data: unknown): { message: string; field?: string } {
  if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
    const field = 'field' in data && typeof data.field === 'string' ? data.field : undefined;
    return { message: data.message, field };
  }
  return { message: GENERIC_ERROR };
}

async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const { message, field } = readError(data);
    throw new ApiError(response.status, message, field);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
};
