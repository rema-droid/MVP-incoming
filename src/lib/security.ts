/**
 * Security utilities for validating and sanitizing inputs.
 */

/**
 * Validates that a repository URL is a safe HTTPS URL.
 * Prevents SSRF and common injection patterns in URLs.
 */
export function isValidRepoUrl(url: string): boolean {
  // Only allow HTTPS URLs with safe characters
  const repoUrlRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoUrlRegex.test(url);
}

/**
 * Sanitizes a repository ID to ensure it only contains alphanumeric characters and hyphens.
 * Useful for generating safe application names or file paths.
 */
export function sanitizeRepoId(id: string | number): string {
  const strId = String(id);
  // Strip everything except a-z, A-Z, 0-9, and -
  return strId.replace(/[^a-zA-Z0-9-]/g, '');
}
