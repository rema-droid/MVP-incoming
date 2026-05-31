/**
 * Validates a repository URL to ensure it is a safe GitHub URL.
 * Prevents SSRF and command injection by enforcing a strict format.
 */
export function isValidRepoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Enforce HTTPS and github.com hostname
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'github.com') {
      return false;
    }

    // Path should be /owner/repo
    // Valid characters for owner and repo: alphanumeric, hyphen, dot, underscore
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length !== 2) {
      return false;
    }

    const [owner, repo] = pathParts;
    const validSegment = /^[a-zA-Z0-9-._]+$/;

    return validSegment.test(owner) && validSegment.test(repo);
  } catch {
    return false;
  }
}
