## 2025-05-14 - Subprocess Command Injection Prevention
**Vulnerability:** Use of `exec` with unsanitized user input in `build-engine/worker.ts` and missing `--` separator in `git clone` calls.
**Learning:** Shell execution (`exec`) is extremely dangerous when handling user-provided repository URLs or IDs. Even with non-shell execution (`spawn`), argument injection is possible in tools like `git clone` if a malicious URL starts with a hyphen (e.g., `--upload-pack=...`).
**Prevention:**
1. Always use `spawn` with `shell: false` and explicit argument arrays.
2. Use the `--` separator before positional arguments in CLI tools (e.g., `git clone -- <url>`).
3. Sanitize all inputs used for resource names (Fly apps, Docker networks) to alphanumeric/hyphens only.
4. Validate URLs against a strict HTTPS-only regex.
5. In this project's multi-package setup, when importing from `src/lib` into `build-engine`, omit the `.ts` extension to ensure compatibility with `tsc`.
