import { getUserBySessionId } from '../services/userServices.js';

export async function requireAuth(req, res, next) {
  try {
    const user = await getUserBySessionId(req.cookies.session_id);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error checking authentication:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
