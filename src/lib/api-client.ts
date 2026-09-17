export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`${url} responded ${status}`);
    this.name = "ApiError";
  }
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * The single place a request leaves this app. It returns `unknown`, so the
 * caller decodes the body with the schema that owns its shape.
 */
export const apiFetch = async (
  path: string,
  init: RequestInit,
): Promise<unknown> => {
  const url = `${baseUrl}${path}`;
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    throw new ApiError(response.status, url);
  }
  return response.json();
};
