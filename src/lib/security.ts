/**
 * Validates that a repository URL is a valid HTTPS URL and does not contain
 * characters that could be used for shell command injection or other attacks.
 */
export function isValidRepoUrl(url: string): boolean {
  // Only allow HTTPS URLs from known domains if possible,
  // but at least ensure it's a valid URL format and has no shell metacharacters.
  const repoUrlRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoUrlRegex.test(url);
}

/**
 * Sanitizes a repository ID to be used in shell commands, file paths, etc.
 * Restricts the ID to alphanumeric characters and hyphens.
 */
export function sanitizeRepoId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, '');
}
