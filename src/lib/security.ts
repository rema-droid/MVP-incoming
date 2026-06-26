import { randomBytes } from "crypto";

/**
 * Validates GitHub repository URLs to prevent command injection.
 * Supports:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+(\.git)?$/;

/**
 * Validates Fly.io app names.
 * App names must start and end with an alphanumeric character and can contain hyphens.
 */
export const APP_NAME_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Validates environment variable keys to prevent argument injection.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure random alphanumeric token.
 * Uses rejection sampling to avoid modulo bias.
 */
export function randomToken(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const result = new Array(length);
  let i = 0;
  while (i < length) {
    const byte = randomBytes(1)[0];
    if (byte < 256 - (256 % chars.length)) {
      result[i] = chars[byte % chars.length];
      i++;
    }
  }
  return result.join("");
}
