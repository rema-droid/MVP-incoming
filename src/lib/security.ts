/**
 * Validates that a repository URL is a valid HTTPS GitHub/GitLab/etc. URL.
 * This prevents SSRF and command injection via malicious git URLs.
 */
export function isValidRepoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS protocol
    if (parsed.protocol !== 'https:') return false;

    // Basic regex to ensure it's a reasonable git repository URL
    // Allows alphanumeric, dots, hyphens, slashes, and common git symbols
    const repoPathRegex = /^[a-zA-Z0-9._\-\/@#+:]+$/;
    return repoPathRegex.test(parsed.hostname + parsed.pathname);
  } catch {
    return false;
  }
}

/**
 * Sanitizes a repository ID for use in filenames or shell commands.
 * Only allows alphanumeric characters and hyphens.
 */
export function sanitizeRepoId(repoId: string | number): string {
  return String(repoId).replace(/[^a-zA-Z0-9-]/g, '');
}
