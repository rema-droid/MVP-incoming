import { randomBytes } from "crypto";

export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/;
export const APP_NAME_REGEX = /^[a-z0-9-]+$/;
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure random token using rejection sampling
 * to ensure uniform distribution.
 */
export function randomToken(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charCount = chars.length;
  const maxUint8 = 256;
  const limit = maxUint8 - (maxUint8 % charCount);

  let result = "";
  while (result.length < length) {
    const bytes = randomBytes(length - result.length);
    for (let i = 0; i < bytes.length && result.length < length; i++) {
      if (bytes[i] < limit) {
        result += chars[bytes[i] % charCount];
      }
    }
  }
  return result;
}
