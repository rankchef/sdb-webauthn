import pool from '../db.js';

export async function getNotesByUserId(userId) {
  const result = await pool.query(
    `SELECT id, title, content, is_archived, created_at, updated_at
     FROM notes
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function getNoteById(userId, noteId) {
  const result = await pool.query(
    `SELECT id, title, content, is_archived, created_at, updated_at
     FROM notes
     WHERE id = $1 AND user_id = $2`,
    [noteId, userId]
  );
  return result.rows[0] || null;
}

export async function createNote(userId, { title, content }) {
  const result = await pool.query(
    `INSERT INTO notes (user_id, title, content)
     VALUES ($1, $2, $3)
     RETURNING id, title, content, is_archived, created_at, updated_at`,
    [userId, title, content ?? null]
  );
  return result.rows[0];
}

export async function updateNote(userId, noteId, fields) {
  const sets = [];
  const values = [];

  if (fields.title !== undefined) {
    values.push(fields.title);
    sets.push(`title = $${values.length}`);
  }
  if (fields.content !== undefined) {
    values.push(fields.content);
    sets.push(`content = $${values.length}`);
  }
  if (fields.is_archived !== undefined) {
    values.push(fields.is_archived);
    sets.push(`is_archived = $${values.length}`);
  }

  if (sets.length === 0) return getNoteById(userId, noteId);

  values.push(noteId, userId);
  const result = await pool.query(
    `UPDATE notes
     SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING id, title, content, is_archived, created_at, updated_at`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteNote(userId, noteId) {
  const result = await pool.query(
    'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
    [noteId, userId]
  );
  return result.rowCount > 0;
}
