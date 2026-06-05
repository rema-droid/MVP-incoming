/**
 * Validates that a string is a legitimate GitHub repository URL.
 * Enforces HTTPS and the github.com domain.
 */
export function isValidRepoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    if (parsed.hostname !== "github.com") return false;

    // Expected pathname format: /owner/repo
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return false;

    // GitHub owner and repo names allow alphanumeric, hyphens, dots, and underscores.
    const ownerRepoRegex = /^[a-zA-Z0-9-._]+$/;
    return ownerRepoRegex.test(parts[0]) && ownerRepoRegex.test(parts[1]);
  } catch {
    return false;
  }
}
