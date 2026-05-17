/**
 * Validates that a repository URL is a valid HTTPS URL.
 * Mitigates SSRF and command injection risks.
 */
export function isValidRepoUrl(url: string): boolean {
  return /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/.test(url);
}

/**
 * Sanitizes a repository ID for use in file paths or app names.
 * Strips all characters except alphanumeric and hyphens.
 */
export function sanitizeRepoId(repoId: string): string {
  return repoId.replace(/[^a-zA-Z0-9-]/g, '');
}
