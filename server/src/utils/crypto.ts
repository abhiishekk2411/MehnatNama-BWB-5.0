import crypto from 'crypto';

export function generateVerificationToken(): { rawToken: string; tokenHash: string } {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function hashPayload(payload: unknown): string {
  const serialized = JSON.stringify(payload, Object.keys(payload as object).sort());
  return crypto.createHash('sha256').update(serialized).digest('hex');
}
