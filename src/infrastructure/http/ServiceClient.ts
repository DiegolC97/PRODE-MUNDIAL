/**
 * Generic typed HTTP client used by the Next.js BFF to talk to microservices.
 * Lives in infrastructure so the application layer never imports `fetch` directly.
 */
export class ServiceClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, { method: 'GET' });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return (await res.json()) as T;
  }

  async post<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return (await res.json()) as TResponse;
  }
}
