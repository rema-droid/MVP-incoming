/**
 * Validates a repository URL to prevent SSRF and command injection.
 * Only allows https URLs with a specific set of safe characters.
 */
export function isValidRepoUrl(url: string): boolean {
  const repoUrlRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoUrlRegex.test(url);
}

/**
 * Sanitizes a repository ID for use in file paths or resource names.
 * Removes all characters except alphanumeric and hyphens.
 */
export function sanitizeRepoId(repoId: string | number): string {
  return String(repoId).replace(/[^a-zA-Z0-9-]/g, "");
}
