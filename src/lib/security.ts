/**
 * Validates a repository URL to ensure it is a valid HTTPS link and contains no
 * potentially dangerous shell metacharacters or unauthorized protocols.
 */
export function isValidRepoUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  // Regex to ensure HTTPS and allow typical repo URL characters while blocking shell metacharacters.
  const repoRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoRegex.test(url);
}

/**
 * Sanitizes a repository ID by restricting it to alphanumeric characters and hyphens.
 * This prevents command injection or path traversal when the ID is used in file paths
 * or application names.
 */
export function sanitizeRepoId(id: string | number): string {
  const strId = String(id);
  return strId.replace(/[^a-zA-Z0-9-]/g, '');
}
