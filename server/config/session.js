export const SESSION_COOKIE = 'session_id';
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_MAX_AGE_MS,
};
