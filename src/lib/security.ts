import { randomBytes } from "crypto";

/**
 * Validates that a string is a valid GitHub repository URL.
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(?:\.git)?$/;

/**
 * Validates that an environment variable key contains only alphanumeric characters and underscores.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure, unbiased random token of a given length.
 * Uses rejection sampling to avoid modulo bias.
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
      const byte = bytes[i];
      if (byte < limit) {
        result += chars[byte % charCount];
      }
    }
  }
  return result;
}
