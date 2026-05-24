/**
 * Validates that a string is a safe HTTPS repository URL.
 * Prevents shell metacharacters and ensures HTTPS.
 */
export function isValidRepoUrl(url: string): boolean {
  return /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/.test(url);
}

/**
 * Sanitizes a repository ID or name to be used in shell commands,
 * file paths, or container names.
 * Restricts to alphanumeric characters and hyphens.
 */
export function sanitizeRepoId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, "");
}
