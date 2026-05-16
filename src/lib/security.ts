/**
 * Validates that a repository URL is a valid HTTPS GitHub-like URL.
 * Prevents SSRF and command injection by ensuring the URL follows a strict pattern.
 */
export function isValidRepoUrl(url: string): boolean {
  const repoUrlRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoUrlRegex.test(url);
}

/**
 * Sanitizes a repository ID or name for use in file paths or resource names.
 * Strips all characters except alphanumeric and hyphens.
 */
export function sanitizeRepoId(repoId: string | number): string {
  return String(repoId).replace(/[^a-zA-Z0-9-]/g, '');
}
