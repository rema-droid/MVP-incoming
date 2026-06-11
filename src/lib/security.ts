/**
 * Security constants and utilities for the Open Source OS.
 */

/**
 * Strict regex for GitHub repository URLs to prevent command injection and ensure valid targets.
 * Matches: https://github.com/owner/repo or https://github.com/owner/repo.git
 */
export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;

/**
 * Regex for validating environment variable keys.
 * Ensures keys are alphanumeric or underscores, preventing shell/Docker command injection.
 */
export const ENV_KEY_REGEX = /^[a-zA-Z0-9_]+$/;
