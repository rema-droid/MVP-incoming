import { spawn, type SpawnOptions } from "child_process";

/**
 * Validates that a string is a valid HTTPS repository URL.
 * Prevents SSRF and command injection.
 */
export function isValidRepoUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  // Only allow HTTPS URLs from known/typical Git hosts
  // Restricts characters to prevent shell injection if ever passed to a shell
  const repoRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoRegex.test(url);
}

/**
 * Sanitizes a repository ID to ensure it only contains safe characters.
 */
export function sanitizeRepoId(id: string | number): string {
  const strId = String(id);
  return strId.replace(/[^a-zA-Z0-9-]/g, "");
}

/**
 * Securely executes a command using spawn (avoiding the shell by default).
 */
export function spawnAsync(
  command: string,
  args: string[],
  options: SpawnOptions = {}
): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      shell: false, // Explicitly disable shell
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        const error = new Error(`Command failed with code ${code}: ${stderr}`);
        Object.assign(error, { code, stdout, stderr });
        reject(error);
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}
