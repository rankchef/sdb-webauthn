import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  getNotesByUserId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../services/noteServices.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const notes = await getNotesByUserId(req.user.id);
    return res.json({ notes });
  } catch (err) {
    console.error('Error loading notes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await getNoteById(req.user.id, req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.json({ note });
  } catch (err) {
    console.error('Error loading note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body || {};
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const note = await createNote(req.user.id, {
      title: String(title).trim(),
      content: content ?? null,
    });
    return res.status(201).json({ note });
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { title, content, is_archived } = req.body || {};
    const fields = {};

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }
      fields.title = String(title).trim();
    }
    if (content !== undefined) fields.content = content;
    if (is_archived !== undefined) fields.is_archived = Boolean(is_archived);

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const note = await updateNote(req.user.id, req.params.id, fields);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.json({ note });
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteNote(req.user.id, req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
