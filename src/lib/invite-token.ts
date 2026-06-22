import { createHmac } from 'crypto';

const TOKEN_VALIDITY_SECONDS = 24 * 60 * 60;

function hmac(timestamp: string): string {
  return createHmac('sha256', process.env.CLERK_SECRET_KEY!)
    .update(timestamp)
    .digest('hex');
}

export function createInviteToken(): string {
  const ts = String(Math.floor(Date.now() / 1000));
  return `${ts}.${hmac(ts)}`;
}

export function verifyInviteToken(token: string): boolean {
  const [tsStr, sig] = token.split('.');
  if (!tsStr || !sig) return false;

  const timestamp = parseInt(tsStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now - timestamp > TOKEN_VALIDITY_SECONDS) return false;

  return sig === hmac(tsStr);
}
