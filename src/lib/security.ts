import { randomBytes } from "crypto";

/**
 * Strict regex for GitHub repository URLs to prevent injection in git commands.
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+(?:\.git)?$/;

/**
 * Strict regex for application names (Fly.io apps, Docker containers).
 */
export const APP_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * Strict regex for environment variable keys to prevent injection in shell/Docker commands.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure random alphanumeric token.
 * Uses rejection sampling to ensure an unbiased distribution.
 */
export function randomToken(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsLength = chars.length;
  let result = "";

  while (result.length < length) {
    const byte = randomBytes(1)[0];
    // Rejection sampling to avoid modulo bias
    if (byte < 256 - (256 % charsLength)) {
      result += chars[byte % charsLength];
    }
  }

  return result;
}
