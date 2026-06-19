import { randomBytes } from "crypto";

/**
 * Strict regex for GitHub repository URLs.
 * Matches: https://github.com/owner/repo or https://github.com/owner/repo.git
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+(?:\.git)?$/;

/**
 * Regex for valid application names (lowercase alphanumeric and hyphens).
 */
export const APP_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * Regex for valid environment variable keys (alphanumeric and underscores).
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure random alphanumeric token.
 * Uses rejection sampling to ensure unbiased distribution.
 */
export function randomToken(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsLength = chars.length;
  let result = "";

  while (result.length < length) {
    const byte = randomBytes(1)[0];
    // Use rejection sampling to avoid modulo bias
    // 256 / 62 = 4.129, so we reject values >= 62 * 4 (248)
    if (byte < 248) {
      result += chars[byte % charsLength];
    }
  }

  return result;
}
