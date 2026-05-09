/**
 * Validates a repository URL to mitigate SSRF and command injection risks.
 * Allows branch fragments and credentials while restricting to HTTPS.
 */
export function isValidRepoUrl(url: string): boolean {
  const repoRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoRegex.test(url);
}

/**
 * Sanitizes a repository ID for use in system-level names (e.g., Fly app names, directory paths).
 * Strips all characters except alphanumeric and hyphens.
 */
export function sanitizeRepoId(repoId: string | number): string {
  return repoId.toString().replace(/[^a-zA-Z0-9-]/g, '');
}
