/**
 * Security utilities for GitMurph
 */

/**
 * Validates a repository URL to ensure it is an HTTPS link and contains no shell metacharacters.
 * Mitigates SSRF and command injection risks.
 */
export function isValidRepoUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  // Allows https://github.com/user/repo, including subdirectories and common URL chars
  // but excludes shell metacharacters like ; & | $ ` > <
  const repoRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoRegex.test(url);
}

/**
 * Sanitizes a repository ID to be used in file paths or application names.
 * Restricts to alphanumeric characters and hyphens.
 */
export function sanitizeRepoId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, '');
}
