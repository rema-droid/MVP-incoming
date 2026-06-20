import { randomBytes } from 'crypto';

/**
 * Validates that a string is a valid GitHub repository URL.
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/;

/**
 * Validates that an environment variable key contains only alphanumeric characters and underscores.
 * This prevents injection into shell commands and Docker configurations.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Validates that an application name contains only lowercase alphanumeric characters and hyphens.
 * This is compatible with hosting providers like Fly.io and prevents shell injection.
 */
export const APP_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * Generates a cryptographically secure random alphanumeric token.
 * Uses rejection sampling to ensure an unbiased distribution.
 */
export function randomToken(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charsLength = chars.length;
  let result = '';

  while (result.length < length) {
    const bytes = randomBytes(1);
    const byte = bytes[0];

    // 256 % 62 = 8. To avoid modulo bias, we reject values >= 256 - (256 % 62) = 248.
    if (byte < 248) {
      result += chars[byte % charsLength];
    }
  }

  return result;
}
