## 2026-04-01 - Command Injection & Disk Space Leakage in Background Build Engine
**Vulnerability:** Shell-based command execution using untrusted parameters (such as repository IDs or clone URLs) allowed potential command injection, combined with failure to guarantee workspace cleanup on exceptions leading to disk/workspace leakage.
**Learning:** Background queue worker parameters received directly from API layers bypass traditional client-side/route-level validation when processed in separate runtimes/worker scripts. Cleanup logic relying purely on linear try-catch blocks can be skipped if errors occur before the cleanup line is reached.
**Prevention:**
1. Implement validation at both the route layer and inside the worker itself (defense-in-depth).
2. Utilize exact format constraints (`GITHUB_URL_REGEX`, `APP_NAME_REGEX`) before interpolating values into commands.
3. Wrap all workspace creation and subprocess routines in a try/finally architecture, employing native safe methods (`fs.promises.rm` instead of shell commands) inside `finally` to guarantee teardown under any failure state.
