/**
 * Validates a repository URL to prevent SSRF and command injection.
 * Allows https URLs with alphanumeric characters, dots, underscores, hyphens, slashes, @, #, +, and colons.
 */
export function isValidRepoUrl(url: string): boolean {
  const repoUrlRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoUrlRegex.test(url);
}

/**
 * Sanitizes a repository ID to be used in OS-level names (like Fly app names or directory paths).
 * Only allows alphanumeric characters and hyphens.
 */
export function sanitizeRepoId(repoId: string | number): string {
  return String(repoId).replace(/[^a-zA-Z0-9-]/g, "");
}
