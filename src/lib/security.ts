/**
 * Validates if a repository URL is a valid HTTPS GitHub/GitLab/etc URL.
 * Prevents argument injection and SSRF by restricting characters.
 */
export function isValidRepoUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  // Restrict to HTTPS and safe characters to prevent --upload-pack etc.
  return /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/.test(url);
}

/**
 * Sanitizes a repository ID to be safe for use in file paths or app names.
 * Only allows alphanumeric characters and hyphens.
 */
export function sanitizeRepoId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, "");
}
