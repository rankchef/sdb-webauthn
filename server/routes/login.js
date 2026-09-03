import express from 'express';
import {
  setUserChallenge,
  findUserByUsername,
  getUserPasskeysFormatted,
  verifyAndCompleteLogin,
  createSession,
} from '../services/userServices.js';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { SESSION_COOKIE, cookieOptions } from '../config/session.js';

const router = express.Router();

router.post('/generate-options', async (req, res) => {
  try {
    const { username } = req.body || {};

    const user = await findUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const allowCredentials = await getUserPasskeysFormatted(user.id);
    if (allowCredentials.length === 0) return res.status(400).json({ error: 'No passkeys found for this user. Please register first.' });

    const options = await generateAuthenticationOptions({
      rpID: process.env.RP_ID,
      allowCredentials,
      userVerification: 'preferred',
    });

    await setUserChallenge(options, user);

    res.json({ options });
  } catch (err) {
    console.error('Error generating authentication options:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { credential } = req.body || {};
    const { userId, ...result } = await verifyAndCompleteLogin(credential);

    const sessionId = await createSession(userId);
    res.cookie(SESSION_COOKIE, sessionId, cookieOptions);

    return res.json(result);
  } catch (err) {
    console.error('Error verifying authentication:', err);
    const status = err.message.includes('Missing') || err.message.includes('not found') || err.message.includes('expired') || err.message.includes('failed') ? 400 : 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
