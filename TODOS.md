# TODOS

## P2: Add Content Security Policy (CSP) meta tag
**What:** Add `<meta http-equiv="Content-Security-Policy">` to `index.html` with a policy allowing scripts from unpkg.com, styles from Google Fonts and inline, images from any source, and connections to CARTO basemaps.
**Why:** Defense-in-depth against XSS. Even with sanitized popup HTML and SRI hashes, a CSP restricts what any injected script can do.
**Effort:** S (human: ~30 min / CC: ~5 min)
**Depends on:** XSS fix and SRI hashes should be implemented first so the CSP allowlist is accurate.
**Context:** Identified during CEO review (2026-04-06). The site currently has no CSP — any XSS that bypasses sanitization has unrestricted access to all browser APIs.
