import crypto from 'crypto';

/**
 * Generates a high-entropy cryptographically secure random token (64 hex chars = 256 bits).
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Computes a SHA-256 hash of a raw token.
 * Raw tokens are never stored in the database; only their hashes are stored.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
