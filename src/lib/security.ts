/**
 * Security utilities for validating and sanitizing inputs.
 */

/**
 * Validates that a repository URL is a valid HTTPS URL.
 * Prevents SSRF and some forms of command injection by restricting the protocol and characters.
 */
export function isValidRepoUrl(url: string): boolean {
  return /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/.test(url);
}

/**
 * Sanitizes a repository ID to be used in resource names or paths.
 * Allows only alphanumeric characters and hyphens.
 */
export function sanitizeRepoId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, '');
}
