/**
 * Validates that a repository URL is an HTTPS link and contains only safe characters.
 * This helps prevent SSRF and command injection.
 */
export function isValidRepoUrl(url: string): boolean {
  if (!url) return false;
  // Strictly allow HTTPS and alphanumeric, dots, hyphens, underscores, slashes, @, #, +, :
  const repoRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoRegex.test(url);
}

/**
 * Sanitizes a repository ID to ensure it contains only alphanumeric characters and hyphens.
 * This is used for constructing safe app names and file paths.
 */
export function sanitizeRepoId(id: string | number): string {
  const strId = String(id);
  return strId.replace(/[^a-zA-Z0-9-]/g, '');
}
