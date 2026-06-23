import { randomBytes } from "crypto";

export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+(\.git)?$/;
export const APP_NAME_REGEX = /^[a-z0-9-]+$/;
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure random alphanumeric token.
 * Uses rejection sampling to ensure a perfectly uniform distribution.
 */
export function randomToken(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsLength = chars.length;
  const maxByteValue = 256 - (256 % charsLength);
  let result = "";

  while (result.length < length) {
    const bytes = randomBytes(length - result.length);
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] < maxByteValue) {
        result += chars[bytes[i] % charsLength];
      }
    }
  }

  return result;
}
