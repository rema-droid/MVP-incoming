import { randomBytes } from "crypto";

/**
 * Security constants and validation utilities.
 */

/**
 * Validates GitHub repository URLs to prevent command injection and ensure data integrity.
 * Matches: https://github.com/owner/repo or https://github.com/owner/repo.git
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(?:\.git)?$/;

/**
 * Validates application names for Fly.io.
 * Fly app names must be lowercase alphanumeric and can include hyphens.
 */
export const APP_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * Validates environment variable keys to prevent injection.
 * Keys must only contain alphanumeric characters and underscores.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Generates a cryptographically secure random alphanumeric token.
 * Uses rejection sampling to avoid modulo bias.
 */
export function randomToken(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let value = "";
  while (value.length < length) {
    const byte = randomBytes(1)[0];
    if (byte === undefined) continue;
    if (byte < chars.length * Math.floor(256 / chars.length)) {
      value += chars[byte % chars.length];
    }
  }
  return value;
}
