import { randomBytes } from "crypto";

/**
 * Validates GitHub repository URLs.
 * Matches https://github.com/owner/repo (with optional .git suffix)
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(?:\.git)?\/?$/;

/**
 * Validates application names.
 * Alphanumeric characters and hyphens only, lowercase.
 */
export const APP_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * Validates environment variable keys.
 * Alphanumeric characters and underscores only.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure random token of the specified length.
 * Uses rejection sampling to ensure a uniform distribution of alphanumeric characters.
 */
export function randomToken(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsLength = chars.length;
  const maxValidByte = 256 - (256 % charsLength);
  let result = "";

  while (result.length < length) {
    const bytes = randomBytes(length - result.length);
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      if (byte < maxValidByte) {
        result += chars[byte % charsLength];
      }
    }
  }

  return result;
}
