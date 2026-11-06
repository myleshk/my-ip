# Claude checker investigation

Inspected 2026-11-05: https://ip.net.coffee/claude/ and its public script
https://ip.net.coffee/claude/claude-page.js?v=20260916a.

## What it measures

- Fetches `https://claude.ai/cdn-cgi/trace` and reads `ip` and `loc`. This observes the browser's exit to that hostname. It does not establish the exit used by Claude Code, API traffic, or a differently configured proxy.
- Sends that IP to its own `/api/iprisk/{ip}` and `/api/geoip/{ip}` endpoints. The backend supplies VPN/proxy/Tor/abuse flags, ASN, geolocation and `trust_score`. The public script says the score is computed per CIDR and cached for 365 days. The backend formula and actual cache policy cannot be verified from this script.
- Fetches Claude and Anthropic trace endpoints with `mode: 'no-cors'` and times completion. An opaque response hides HTTP status, so a denial or challenge can appear healthy. This measures request completion, not login or model availability.
- Loads random subdomains under `d.ip.net.coffee`, then polls `/api/dns/result/{token}` to discover recursive DNS resolver addresses. Resolver geography alone cannot establish a DNS leak.
- Uses Google and Cloudflare STUN through WebRTC to collect candidate IPs. Its IPv4 regex misses IPv6 and does not distinguish candidate types reliably.
- Displays device/browser signals and stores IP history locally. It also silently POSTs Claude, Cloudflare and China-route IPs to `/api/session`; local history storage does not mean all observations stay on-device.

## Improvements, in priority order

1. Separate **network reachability**, **region eligibility**, **IP reputation**, and **authenticated service availability**. Remove claims that a third-party trust score is Claude's own account-risk score. Show each source and observation time.
2. For opaque fetch completion, display “Network response received; HTTP status unavailable.” For rejection or timeout, display “Inconclusive” with the reason. A browser CORS failure does not prove the service is blocked. Use readable successful responses only for stronger endpoint-specific claims.
3. Label the trace IP “Browser exit to claude.ai.” Keep failed lookups unknown; never substitute a different hostname's exit. Offer separate explicit CLI/API diagnostics if those routes matter. A server-side probe measures the server's route, not the user's.
4. Keep missing reputation flags unknown rather than treating undefined as false. Display score provenance, model/version, IP versus CIDR scope and cache age. Refresh stale records; a year-old subnet score is weak evidence for today's individual IP.
5. For WebRTC, inspect structured ICE candidate fields, accept IPv4 and IPv6, separate host/srflx/relay candidates and close the connection in a finally block. No observed candidate means “No public candidate observed,” not proof of no leak.
6. Show DNS resolver observations and compare them with the user's intended DNS policy. Do not infer a leak solely from country or a mismatch with the web exit.
7. Disclose session reporting before collection and make it optional. Avoid collecting canvas/device fingerprints unless the user explicitly requests that diagnostic; explain their limited relevance to reachability.
8. Use uncached repeated measurements and report median request duration, clearly distinguishing it from ICMP ping. Preserve errors and partial results independently.

## Acceptance scenarios for an implementation

- Opaque HTTP 403 completion cannot produce “Claude available.”
- CORS rejection, timeout and malformed trace data remain inconclusive.
- Missing risk data never renders as a clean reputation result.
- IPv6 server-reflexive ICE candidates are shown; private host candidates are not classified as public exits.
- An empty STUN result does not produce a definitive no-leak claim.
- Browser, CLI and API exits remain separately attributed.
- Disabling optional reporting prevents session POSTs.

This repository currently contains a separate Firebase/Vue IP lookup application,
not the Net.Coffee checker. No production checker was changed by this review.
