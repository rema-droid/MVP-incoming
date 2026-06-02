/**
 * Validates that a given string is a valid GitHub repository URL.
 * Enforces HTTPS, github.com hostname, and a valid /owner/repo path.
 */
export function isValidRepoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Enforce HTTPS for security
    if (parsed.protocol !== 'https:') {
      return false;
    }

    // Only allow github.com
    if (parsed.hostname !== 'github.com') {
      return false;
    }

    // Path must be exactly /owner/repo (2 parts)
    const parts = parsed.pathname.split('/').filter(p => p.length > 0);
    if (parts.length !== 2) {
      return false;
    }

    const [owner, repo] = parts;

    // GitHub usernames and repo names allow alphanumeric characters, hyphens, dots, and underscores.
    // This regex avoids shell-sensitive characters.
    const validNameRegex = /^[a-zA-Z0-9-._]+$/;

    return validNameRegex.test(owner) && validNameRegex.test(repo);
  } catch {
    // If URL parsing fails, it's not a valid URL
    return false;
  }
}
