import pool from '../db.js';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import crypto from 'node:crypto';

export async function findUserByUsername(username) {
  const result = await pool.query(
    'SELECT id, username FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

export async function createUser(username) {
  const result = await pool.query(
    'INSERT INTO users (username) VALUES ($1) RETURNING id, username',
    [username]
  );
  return result.rows[0];
}

function toBase64UrlId(id) {
  return Buffer.from(id, 'base64').toString('base64url');
}

export async function getUserPasskeysFormatted(userId) {
  const passkeysResult = await pool.query('SELECT * FROM passkeys WHERE user_id = $1', [userId]);
  
  return passkeysResult.rows.map(pk => ({
    id: toBase64UrlId(pk.id),
    type: 'public-key',
    transports: ['internal']
  }));
}

export async function setUserChallenge(options, user){
    await pool.query('UPDATE users SET current_challenge = $1 WHERE id = $2', [options.challenge, user.id]);
}

export async function getUserChallenge(userId) {
  const result = await pool.query(
    'SELECT current_challenge FROM users WHERE id = $1', 
    [userId]
  );
  return result.rows[0]?.current_challenge;
}

export async function savePasskeyAndClearChallenge(userId, registrationInfo) {
  const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;
  const { id: credentialID, publicKey: credentialPublicKey, counter } = credential;

  await pool.query(
    `INSERT INTO passkeys (id, user_id, public_key, counter, device_type, backed_up)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      credentialID,
      userId,
      Buffer.from(credentialPublicKey).toString('base64'),
      counter,
      credentialDeviceType,
      credentialBackedUp
    ]
  );

  await pool.query(
    'UPDATE users SET current_challenge = NULL WHERE id = $1',
    [userId]
  );
}

export async function getUserByChallenge(challenge) {
  const result = await pool.query(
    'SELECT id, username, current_challenge FROM users WHERE current_challenge = $1',
    [challenge]
  );
  return result.rows[0] || null;
}

export async function getPasskeyByCredentialId(credentialId) {
  const asBase64 = Buffer.from(credentialId, 'base64url').toString('base64');
  const result = await pool.query(
    'SELECT * FROM passkeys WHERE id = $1 OR id = $2',
    [credentialId, asBase64]
  );
  return result.rows[0] || null;
}

export async function updatePasskeyCounter(credentialId, newCounter) {
  await pool.query(
    'UPDATE passkeys SET counter = $1 WHERE id = $2',
    [newCounter, credentialId]
  );
}

export async function verifyAndCompleteLogin(credential) {
  if (!credential || !credential.id) {
    throw new Error('Missing or invalid credential payload');
  }

  const passkey = await getPasskeyByCredentialId(credential.id);
  if (!passkey) {
    throw new Error('Passkey not found');
  }

  const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [passkey.user_id]);
  const dbUser = userResult.rows[0];

  if (!dbUser || !dbUser.current_challenge) {
    throw new Error('Invalid or expired login session');
  }

  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: dbUser.current_challenge,
    expectedOrigin: process.env.EXPECTED_ORIGIN,
    expectedRPID: process.env.RP_ID,
    credential: {
      id: toBase64UrlId(passkey.id),
      publicKey: new Uint8Array(Buffer.from(passkey.public_key, 'base64')),
      counter: Number(passkey.counter),
      transports: ['internal'],
    },
    requireUserVerification: false,
  });

  if (!verification.verified || !verification.authenticationInfo) {
    throw new Error('Authentication failed');
  }

  await updatePasskeyCounter(passkey.id, verification.authenticationInfo.newCounter);
  await pool.query('UPDATE users SET current_challenge = NULL WHERE id = $1', [dbUser.id]);

  return { verified: true, userId: dbUser.id };
}

export async function createSession(userId) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await pool.query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
    [sessionId, userId, expiresAt]
  );

  return sessionId;
}

export async function getUserBySessionId(sessionId) {
  if (!sessionId) return null;

  const result = await pool.query(
    `SELECT u.id, u.username
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId]
  );

  return result.rows[0] || null;
}

export async function deleteSession(sessionId) {
  if (!sessionId) return;
  await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}