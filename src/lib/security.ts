import { randomBytes } from "crypto";

/**
 * Validates that a string is a valid GitHub repository URL.
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/;

/**
 * Validates that an application name contains only lowercase alphanumeric characters and hyphens.
 */
export const APP_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * Validates that an environment variable key contains only alphanumeric characters and underscores.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure random alphanumeric token.
 * Uses rejection sampling to ensure uniform distribution.
 */
export function randomToken(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  while (result.length < length) {
    const bytes = randomBytes(length - result.length);
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      if (byte < 248) { // 256 - (256 % 62) = 248 to avoid bias
        result += chars[byte % 62];
      }
    }
  }
  return result;
}
