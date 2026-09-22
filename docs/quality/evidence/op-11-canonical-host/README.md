# OP-11 canonical-host normalization evidence

Status: `已验收（本地源实现） / 生产未验证 / 未部署`  
Evidence date: `2026-09-02`

## Authorization and boundary

After the four release-gate proposals were presented, the user replied `继续任务`. The work therefore continued only with the recommended OP-11 canonical-host proposal; AI-01, KW-02, PF-01, page content, URL paths, metadata, indexing, sitemap membership, and the next roadmap task were not changed.

On 2026-09-02 at `08:09 +08:00`, the user explicitly replied `OP-11 验收通过，继续下一发布阻断项`. This accepts the local OP-11 source implementation and authorizes opening the next release blocker, AI-01. It is not deployment authorization and does not convert local redirect evidence into production evidence.

The implementation is production-host-only. It accepts exactly `mysquarefaceicon.com` and `www.mysquarefaceicon.com`, sends non-canonical requests to the fixed destination `https://mysquarefaceicon.com`, and never constructs a destination from an arbitrary Host header.

## Implementation

- `lib/seo/canonical-origin.ts`: pure authority/scheme decision and destination builder.
- `middleware.ts`: request guard returning permanent method-preserving `308` responses; Next internal static/image paths remain outside the matcher.
- `scripts/validate-canonical-host.ts`, `scripts/run-canonical-host-check.mjs`, and `tsconfig.canonical-host-check.json`: isolated regression matrix.
- `scripts/post-deploy-check.mjs`: production OP-11 matrix for HTTP apex, HTTP www, HTTPS www, canonical apex, and a nested path/query, including a second-hop assertion.
- `package.json`: adds `npm run canonical:check`.

An initial production-like local probe exposed that `next start` may present an internal request URL even when the public Host header is supplied. The final helper therefore accepts the exact production Host header as a bounded fallback. Re-running the same real HTTP matrix then produced the required results below.

## Local middleware decision matrix

`npm run canonical:check`: `通过`.

- HTTP apex, HTTP www, and HTTPS www return `308` to the HTTPS apex.
- Path and query are preserved.
- A POST request receives `308`, preserving redirect method semantics.
- Valid Cloudflare `cf-visitor` and `x-forwarded-proto` signals are covered.
- HTTPS apex passes through.
- `localhost`, `127.0.0.1`, preview, and unrelated hosts pass through.
- A rewritten internal URL plus an exact production Host header is covered.

## Local production HTTP integration

The final Next production build was served on loopback. Host and forwarded-protocol signals simulated the public edge without changing DNS.

| Probe | Result | Destination |
|---|---:|---|
| HTTP apex `/` | `308` | `https://mysquarefaceicon.com/` |
| HTTP www `/` | `308` | `https://mysquarefaceicon.com/` |
| HTTPS www `/` | `308` | `https://mysquarefaceicon.com/` |
| HTTP www `/oval-face-icon-generator?ref=op11&mode=full` | `308` | same path/query on HTTPS apex |
| canonical nested target | `200` | no further redirect |
| HTTPS apex `/` | `200` | no redirect |
| preview host `/` | `200` | no redirect |
| localhost `/` | `200` | no redirect |
| POST www `/api/comments` | `308` | `https://mysquarefaceicon.com/api/comments` |

## Browser and responsive evidence

Local production output was checked in the in-app browser without activating the game runtime.

- `1440 × 900` root: correct title and single H1, visible Play entry, no horizontal overflow, ready state complete, no console warning/error; visual first viewport passed.
- `390 × 844` root: correct title and single H1, visible Play entry, no horizontal overflow, ready state complete, no console warning/error; mobile first viewport passed.
- `390 × 844` nested path with `?ref=op11&mode=full`: query remained present, H1 was `Oval Face Icon Generator`, canonical remained the query-free HTTPS apex URL, no horizontal overflow, and no console warning/error.
- The temporary viewport override was reset and the temporary browser tab was closed.

## Automated and build results

- `npx tsc --noEmit`: `通过`.
- `npm run lint`: `通过`, zero warnings/errors.
- All 11 accepted task checks from `games:check` through `game-template:check`: `通过`. `game-template:check` still emits the known server-render `fetchPriority` React compatibility warning; it is not hidden.
- `npm run build`: `通过`; 42 generated/static app routes and a `26.8 kB` middleware bundle were reported.
- `npm run cf:build`: `通过`; middleware and Worker bundles were generated and the project OpenNext patch applied. The OpenNext Windows compatibility warning remains visible.
- `node --check scripts/post-deploy-check.mjs`: `通过`.
- Authoritative board v1.33 inline JavaScript and OP-11 release-gate assertions passed before acceptance; the stale `QUALITY_SUPERVISOR.blockers[2]` overwrite was removed so KW-02 remains visible.
- Authoritative board browser check at `1280 × 900` passed before acceptance: the then-current `OP-11 待验收` state, bounded evidence summary, `canonical:check`, gate note, and v1.33 footer rendered with no horizontal overflow or console warning/error.
- `git diff --check` in the project and the scoped authoritative-board diff check in `Liu-library`: `通过`; Windows line-ending notices remain informational.
- Local `seo-check`: `不通过`, with the unchanged 12 KW-02 must findings and 17 should reminders. AI-01 also remains explicitly undecided.

## Release state and remaining blockers

- Production behavior is `未验证` after this source change; the earlier live probe still represents the currently deployed Worker until an authorized deployment occurs.
- The local source implementation is user-accepted, but OP-11 remains an operational production-evidence blocker until an authorized deployment proves the one-hop matrix on the live origin.
- `npm run seo:prod` was not run because no new version was deployed.
- No commit, push, deployment, DNS/Cloudflare setting, KV, R2, D1, content, or schema mutation occurred.
- AI-01, the 12 KW-02 failures, first-Play INP `221 ms`, and Square/Oval exact-license UNKNOWN remain visible release blockers.
- `MIG-SQUARE-001` remains unopened.

## Rollback

Before deployment, source rollback is limited to removing `middleware.ts`, the canonical-origin helper/check files and script entry, and reverting the OP-11 additions in `post-deploy-check.mjs`. No data migration is involved. After a later authorized deployment, the previously recorded Worker rollback candidate is `4f1b0c0c-d984-45ba-9620-e0add7244331`, which must be rechecked immediately before use.

Acceptance record: user explicitly replied `OP-11 验收通过，继续下一发布阻断项` on 2026-09-02.
