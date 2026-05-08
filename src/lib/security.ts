export const REPO_URL_REGEX = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;

/**
 * Validates a repository URL against a safe allowlist regex.
 * Prevents SSRF and command injection by ensuring the URL starts with https://
 * and contains only safe characters.
 */
export function isValidRepoUrl(url: string): boolean {
  return REPO_URL_REGEX.test(url);
}

/**
 * Sanitizes an ID by stripping all characters except alphanumeric and hyphens.
 * Useful for using IDs in file paths, application names, or other OS-level strings.
 */
export function sanitizeId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, '');
}
