export function isValidRepoUrl(url: string): boolean {
  return /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/.test(url);
}

export function sanitizeRepoId(repoId: string | number): string {
  return repoId.toString().replace(/[^a-zA-Z0-9-]/g, '');
}
