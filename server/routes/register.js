import express from 'express';
import {
  setUserChallenge,
  getUserByChallenge,
  findUserByUsername,
  savePasskeyAndClearChallenge,
  createUser,
  getUserPasskeysFormatted,
} from '../services/userServices.js';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

const router = express.Router();

router.post('/generate-options', async (req, res) => {
  try {
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ error: 'Username field is missing' });

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    const user = await createUser(username);

    const excludeCredentials = await getUserPasskeysFormatted(user.id);

    const options = await generateRegistrationOptions({
      rpName: process.env.RP_NAME,
      rpID: process.env.RP_ID,
      userID: new TextEncoder().encode(String(user.id)),
      userName: user.username,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    await setUserChallenge(options, user);

    res.json({ options, userId: user.id });
  } catch (err) {
    console.error('Error generating options: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential || !credential.response?.clientDataJSON) {
      return res.status(400).json({ error: 'Missing or invalid credential payload' });
    }

    const clientDataRaw = Buffer.from(credential.response.clientDataJSON, 'base64url').toString('utf-8');
    const clientData = JSON.parse(clientDataRaw);
    const rawChallenge = clientData.challenge;

    const user = await getUserByChallenge(rawChallenge);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired registration session' });
    }

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: user.current_challenge,
      expectedOrigin: process.env.EXPECTED_ORIGIN,
      expectedRPID: process.env.RP_ID,
      requireUserVerification: false,
    });

    if (verification.verified && verification.registrationInfo) {
      await savePasskeyAndClearChallenge(user.id, verification.registrationInfo);

      return res.json({ verified: true });
    }

    return res.status(400).json({ verified: false, error: 'Verification failed' });
  } catch (err) {
    console.error('Error verifying registration:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
