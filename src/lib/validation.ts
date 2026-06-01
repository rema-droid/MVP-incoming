/**
 * Validates that a string is a valid GitHub repository HTTPS URL.
 * Example: https://github.com/owner/repo
 */
export function isValidRepoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.hostname !== 'github.com') return false;

    // Path should be /owner/repo or /owner/repo.git
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length !== 2) return false;

    const [owner, repo] = parts;
    // Basic alphanumeric/hyphen/dot/underscore check for owner and repo
    const validPart = /^[a-zA-Z0-9-._]+$/;
    return validPart.test(owner) && validPart.test(repo);
  } catch {
    return false;
  }
}
