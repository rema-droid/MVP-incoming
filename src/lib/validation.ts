/**
 * Validates that a given string is a valid GitHub repository URL.
 * It must be an HTTPS URL, point to github.com, and have a valid path (owner/repo).
 * This helps prevent SSRF and command injection attacks.
 */
export function isValidRepoUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Only allow HTTPS
    if (parsedUrl.protocol !== 'https:') {
      return false;
    }

    // Only allow github.com
    if (parsedUrl.hostname !== 'github.com') {
      return false;
    }

    // Path should be /owner/repo (or /owner/repo.git)
    // We expect at least two segments after the initial slash
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2) {
      return false;
    }

    // Basic character validation for owner and repo names
    // GitHub allows alphanumeric, hyphens, underscores, and dots.
    const owner = pathSegments[0];
    const repo = pathSegments[1].replace(/\.git$/, '');

    const githubNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!githubNameRegex.test(owner) || !githubNameRegex.test(repo)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
