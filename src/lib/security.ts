/**
 * Shared security utilities for validation and sanitization.
 */

/**
 * Validates a repository URL to mitigate SSRF and command injection risks.
 * Allows common characters in Git URLs but restricts potentially dangerous ones.
 */
export function isValidRepoUrl(url: string): boolean {
  return /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/.test(url);
}

/**
 * Sanitizes a repository ID by stripping all characters except alphanumeric and hyphens.
 * This is useful for generating safe names for operating system level resources
 * like directory names or cloud application identifiers.
 */
export function sanitizeRepoId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, "");
}
