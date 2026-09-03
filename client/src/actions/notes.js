import { apiFetch } from '../api';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export async function getNotes() {
  return parseResponse(await apiFetch('/notes'));
}

export async function getNote(id) {
  return parseResponse(await apiFetch(`/notes/${id}`));
}

export async function createNote({ title, content }) {
  return parseResponse(
    await apiFetch('/notes', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    })
  );
}

export async function updateNote(id, fields) {
  return parseResponse(
    await apiFetch(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(fields),
    })
  );
}

export async function deleteNote(id) {
  return parseResponse(
    await apiFetch(`/notes/${id}`, {
      method: 'DELETE',
    })
  );
}
