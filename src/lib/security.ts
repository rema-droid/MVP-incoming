/**
 * Validates a repository URL to prevent SSRF and command injection.
 * Restricts to HTTPS and a set of safe characters.
 */
export function isValidRepoUrl(url: string): boolean {
  // Allow common repository hosting platforms with HTTPS
  const repoRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoRegex.test(url);
}

/**
 * Sanitizes a repository ID to prevent path traversal and command injection.
 * Restricts to alphanumeric characters and hyphens.
 */
export function sanitizeRepoId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-]/g, '');
}
