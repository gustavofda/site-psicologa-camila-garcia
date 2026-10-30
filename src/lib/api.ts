export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

const errorText = (d: unknown): string =>
  typeof d === 'object' && d !== null && 'error' in d && typeof d.error === 'string' ? d.error : 'Erro na requisição';

export async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  const json = typeof init.body === 'string';
  const res = await fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers: json ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, errorText(data));
  return data as T; // contrato definido em src/shared/types.ts, produzido pelo nosso servidor
}

export const send = <T>(method: string, url: string, body?: unknown) =>
  api<T>(url, { method, body: body === undefined ? undefined : JSON.stringify(body) });

export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  return (await api<{ url: string }>('/api/admin/upload', { method: 'POST', body: fd })).url;
}
