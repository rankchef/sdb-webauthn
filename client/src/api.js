export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';

export function apiFetch(path, options = {}) {
  const { headers, ...rest } = options;

  return fetch(`${BACKEND_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}
