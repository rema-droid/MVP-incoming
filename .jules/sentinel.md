## 2026-03-30 - SSRF Prevention via Repository URL Validation
**Vulnerability:** Unsanitized `repo.url` payload in `POST /api/run` allowing arbitrary URL targets or non-HTTP protocols.
**Learning:** `createRunJob` accepted any string as `repo.url` without protocol or hostname restrictions, leaving the service vulnerable to Server-Side Request Forgery (SSRF) and internal network target injection.
**Prevention:** Always validate incoming target URLs against explicit protocol (`http:`, `https:`) and domain allowlists (e.g. `github.com` and subdomains) before accepting jobs into queues or execution pipelines.
