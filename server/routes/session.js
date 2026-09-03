import express from 'express';
import { deleteSession } from '../services/userServices.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { SESSION_COOKIE, cookieOptions } from '../config/session.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

router.post('/logout', async (req, res) => {
  try {
    await deleteSession(req.cookies.session_id);
    res.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: 0 });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error logging out:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
