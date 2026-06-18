import { randomBytes } from "crypto";

/**
 * Strict regex for GitHub repository URLs.
 * Matches: https://github.com/owner/repo or https://github.com/owner/repo.git
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+(?:\.git)?$/;

/**
 * Regex for environment variable keys.
 * Only allows alphanumeric characters and underscores.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a secure random alphanumeric token.
 * Uses rejection sampling with crypto.randomBytes to ensure unbiased distribution.
 */
export function randomToken(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  while (result.length < length) {
    const bytes = randomBytes(1);
    const byte = bytes[0];
    if (byte < 248) { // 256 - (256 % 62) = 248
      result += chars[byte % 62];
    }
  }
  return result;
}
