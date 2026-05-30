export function isValidRepoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.hostname !== 'github.com') return false;

    // GitHub path should be /owner/repo
    // We want to avoid paths like /owner/repo/settings or other malicious ones
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) return false;

    // Basic regex for owner and repo names: alphanumeric, underscores, dots, and hyphens
    const nameRegex = /^[a-zA-Z0-9-._]+$/;
    if (!nameRegex.test(pathParts[0]) || !nameRegex.test(pathParts[1])) return false;

    return true;
  } catch {
    return false;
  }
}
