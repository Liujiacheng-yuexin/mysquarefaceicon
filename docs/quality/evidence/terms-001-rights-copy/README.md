# TERMS-001 · Rights-copy implementation evidence

Date: 2026-09-02 (Asia/Shanghai). Implementation recorded at: `2026-09-02T04:44:57.879Z`; runtime verification updated at: `2026-09-02T05:20:08.202Z`. User acceptance recorded at: `2026-09-02T05:42:21.798Z`.

Task: `本地已验收 / 生产未验证`; the source/build/local HTTP/SEO/browser results retain their original v1.43/v1.44 dates. User acceptance: **explicitly received** — `TERMS-001 验收通过`. This closes the local task only, not game rights or production release. Global release: `不通过 / 未部署`.

The user explicitly confirmed `确认 TERMS-001 权利声明修正方案`. This confirms the exact copy proposal, not implementation acceptance, game rights, or production release.

## Delivered scope

- `app/terms-of-service/page.tsx`: replaced only the Generated Icons paragraph, the Game File heading/paragraph, and the actual content-update date (September 2, 2026).
- The approved English copy now says personal/commercial output permissions and the exact files' source/rights/hosting permissions have not been verified. It grants no third-party artwork/game-file license.
- Title, description, H1, canonical, URL, index state, metadata, schema, classes, links, section order, all other paragraphs and the accepted KW-02 sentence are unchanged.
- The application stays server-rendered. No page, game, UI feature, client dependency, CSS, SWF, player, API, privacy/data flow, registry permission or deployment configuration was added or changed.
- `scripts/check-terms-rights.mjs` plus `npm run terms:check` provide exact-source, offline-build and local-HTTP modes. The command rejects non-loopback `--base` values; it never grants rights or claims a source-only run proves browser/production behavior.

## Implementation checks · historical v1.43

All commands used timeout-bounded child processes and explicit exit codes. Captured outputs and the expected pre-fix failure are in `checks.json`.

| Check | Result | Evidence / boundary |
|---|---|---|
| Expected red test against old Terms | Expected exit 1 | Rejected the old Authorized Game File heading before the page patch; not an unresolved failure |
| `npm run terms:check` | Exit 0 | Exact two paragraphs and heading/date; H1=1, H2=7, p=8, main keyword count=3, both links, frozen remaining source |
| Source negative fixtures请帮我启动并且进行验证 | 6 rejected | Old/incorrect rights heading/copy, lost keyword, changed Contact link, stale date, wrong canonical |
| `npm run terms:check -- --built` | Exit 0 | Built HTML matches source and frozen title/description/canonical; no meta noindex; 2 bad HTML fixtures rejected |
| `npx tsc --noEmit` equivalent direct TypeScript CLI | Exit 0 | Full project type check |
| `npm run lint -- --max-warnings=0` | Exit 0 | No ESLint warnings/errors |
| New checker ESLint | Exit 0 | Repeated after adding offline-artifact mode |
| `npm run canonical:check` | Exit 0 | Existing source decision matrix; not production redirects |
| All 11 existing task checks | Exit 0 | games, player, routes, components, metadata, home, home-hero, home-discovery, home-gallery, perf-home, game-template |
| `npm run build` | Exit 0 | Next.js 14.2.35; 42 generated routes; Terms 185 B / first-load JS 87.5 kB; middleware 26.8 kB |
| `npm run cf:build` | Exit 0 | OpenNext 1.3.0; complete Worker bundle plus existing project patch; not deployment |
| Protected source comparison | Pass | 105 existing files checked: only Terms and the added package script changed; no dependency change |
| Exact confirmed proposal comparison | Pass | Both paragraphs and the heading match the approved Markdown blockquotes |
| Offline sitemap | Pass | 20 URLs / 20 unique; Terms included; no lastmod; HTTP statuses not tested here |
| Offline robots | Pass | Generated artifact passes the existing 11-crawler policy validator; not a served HTTP check |
| Terms script/schema inventory | Pass | Same 11 script URLs after build-hash normalization; no added script; JSON-LD count remains 0 |
| Board v1.43 / final diff | Exit 0 | Script syntax, blocked focus, export version, preserved acceptances/CSS/roadmap, no TERMS acceptance or migration start, valid evidence JSON, new-file whitespace and both repository diff checks |

Known warnings are not hidden: the game-template SSR test still emits its prior React `fetchPriority` warning; OpenNext still warns about Windows compatibility. Neither new warning originates from this text-only page edit.

KW-01/02, KW-13/16, CT-03/04, TR-06/07/10, META-05 and the approved no-SEO-change boundaries are checked within the limited source/build scope. KW-04 SERP/semantic coverage was not re-audited; a word count or automated SEO pass is not a semantic-quality or licensing certificate.

## Local-preview blocker · historical v1.43

The flow to test is: `/terms-of-service → Contact → browser Back → Back to Square Face Generator → /`, at desktop `1280 × 900` and mobile `390 × 844`, including keyboard activation.

The Browser plugin is available, connected and a task-only tab was acquired. The background local-server startup command was rejected **before execution** with `CreateProcess: blocked by policy`. A later read-only check found no listener on port 3100; the final check reconfirmed it. No alternate server/browser/transport was used to work around that rejection. The unused task-only tab was confirmed to remain about:blank and closed; no application navigation or viewport override occurred. The earlier board-file browser policy rejection also remains respected; no board HTTP mirror was created.

| Browser / served-page check | Status |
|---|---|
| Raw HTTP 200 and response headers | 未验证 |
| Served robots and fresh full `seo:check` | 未验证 |
| Page identity and nonblank rendered content | 未验证 |
| Framework-overlay and console checks | 未验证 |
| Desktop/mobile screenshot, wrapping and overflow | 未验证 |
| Contact / Back / homepage link and keyboard flow | 未验证 |

The previous PF-01 run's `0 must / 12 should` SEO result is historical, not a fresh TERMS-001 result. All 12 should findings remain separately open. Offline HTML checks above do **not** replace these missing checks. No application screenshots are claimed or fabricated.

User-assisted next step: in `D:\LYXGIT\mysquarefaceicon`, start the documented local server with:

```powershell
npm start -- -H 127.0.0.1 -p 3100
```

After the user confirms it is running, verify exact site identity, then run `npm run terms:check -- --base http://127.0.0.1:3100`, served robots, full local SEO, and the Browser flow. Only after that should the board move to `待验收` and request `TERMS-001 验收通过`.

## Runtime verification completed · historical v1.44

After the user requested `请帮我启动并且进行验证`, the same terminal/startup channel was retried and was accepted this time (exit 0). No alternate shell, browser, host or transport was used to bypass the earlier rejection. Next.js 14.2.35 reported Ready; the loopback listener is `127.0.0.1:3100`, PID `17016`. The service is left running for the user's acceptance.

Preview: [Terms of Service](http://127.0.0.1:3100/terms-of-service). Start command: `node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3100`, equivalent to the documented `npm start -- -H 127.0.0.1 -p 3100`. Startup output is in `C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-terms-001-932330476fa445ab93ee0990ccd5253e/server.stdout.log`; stderr was empty when checked.

| Current check | Result / evidence |
|---|---|
| Terms source, built HTML and actual HTTP | Exit 0; exact approved copy/date, metadata, H1=1/H2=7/p=8/KW=3 and two links; 6 source + 2 HTML negative cases rejected |
| Raw Terms / robots / sitemap | HTTP 200, expected content types, no `X-Robots-Tag: noindex`; all three response hashes equal the existing build artifacts |
| Served crawler policy | Exit 0; 6 training/bulk agents blocked, 5 search/user agents allowed with private-path restrictions |
| Full local `seo:check` | Exit 0; 20 pages, 0 mandatory findings, 12 unchanged should reminders (KW-03 ×1, META-03 ×7, META-04 ×4) |
| Type, zero-warning lint, checker lint, canonical and 11 task regressions | All 15 commands rerun with 120-second per-process timeouts and exit 0; prior game-template `fetchPriority` warning retained |
| Next / OpenNext builds | v1.43 exit-0 results reused, not rebuilt in this follow-up; current source boundaries and served artifacts verified, build ID `jFpce1Vb2axzP6mb3wPJe` |
| Page identity / nonblank / overlay | Pass in desktop 1280×900 and mobile 390×844; expected URL/title, all 8 paragraphs rendered, no framework overlay |
| Console | No warning/error in Terms, Contact and homepage navigation checks |
| Responsive / visual | First-viewport and full-page screenshots inspected; no clipping/overlap; document scrollWidth equals clientWidth: 1265 desktop / 375 mobile (scrollbar excluded) |
| Links / browser Back | Terms → Contact → Back → Terms and Terms → homepage passed |
| Keyboard | Desktop and mobile Tab focus reaches the homepage link then Contact; visible native focus; Enter reaches both correct destinations |
| Frozen scope | The 105 protected-file comparison still differs from the pre-implementation snapshot only for Terms and the added package command; this verification turn changes no application source |
| Board v1.44 / final governance | Exit 0; JavaScript and static/data focus agree on pending acceptance; prior acceptances, CSS, roadmap and PF-01 numbers preserved; no TERMS acceptance or migration start; JSON, source/build/screenshot hashes, whitespace and both Git diff checks pass |

Screenshots are outside the repository and retain original JPEG bytes:

- [Desktop viewport](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/terms-001/desktop-1280x900.jpg) and [desktop full page](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/terms-001/desktop-full.jpg).
- [Mobile viewport](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/terms-001/mobile-390x844.jpg), [mobile full page](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/terms-001/mobile-full.jpg), and [keyboard Contact focus](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/terms-001/mobile-contact-focus.jpg).

`checks.json` retains v1.43 evidence and adds dated `verificationFollowUp` command outputs, browser observations, screenshots/hashes and artifact parity. Temporary test-harness errors (viewport interface, export syntax, and screenshot extension) were corrected and their checks rerun; they were not application failures and did not require application edits or a browser fallback. The viewport override was reset and the Terms preview left open. The board-file browser restriction remains respected: board visual QA is still unverified, with no alternate board server or browser used.

The 12 should reminders, KW-04 semantic review, actual licenses, field/production CWV, real-device/cross-browser coverage, production redirects/SEO and deployment linkage remain outside this local pass. No new performance numbers or production claims are made. At v1.44, the next gate was **`TERMS-001 验收通过`**; the user's subsequent acceptance is recorded below. No next development task has started.

## User acceptance · v1.45

The user explicitly replied `TERMS-001 验收通过`. Acceptance was recorded at `2026-09-02T05:42:21.798Z` for the implemented local `/terms-of-service` wording and the existing verification evidence. The task is now `已完成（本地已验收） / 生产未验证 / 未部署`; this is not permission to host/reuse third-party assets or approval to release.

This turn changes only acceptance/evidence/governance records. The 105 protected-source inventory plus additional tracked checks/config files (107 unique paths) match the v1.44 hashes. Type, lint, regressions, Next/OpenNext builds, HTTP/SEO, browser/mobile/visual and performance checks were **not rerun**; their original dated evidence is retained. The application, Registry, SWFs, player, build output and existing server process are not modified by this acceptance update.

Acceptance governance validation: `通过`, recorded at `2026-09-02T05:49:34.640Z`. Board JavaScript and static/data accepted focus agree; the explicit TERMS-001 source acceptance is present; all 21 previous acceptances, CSS, roadmap and PF-01 evidence remain unchanged; 107 source/check/config hashes and historical v1.43/v1.44 evidence match. Evidence JSON, record consistency, whitespace and both repository `git diff --check` commands pass (exit 0; existing LF-to-CRLF warnings retained). No next task or migration has started. Board visual QA remains `未验证` under the prior local-file browser restriction; no workaround was used.

Square/Oval rights remain UNKNOWN, the other rights-copy candidates and 12 should reminders remain open, and all production gates remain independent. No next blocker or `MIG-SQUARE-001` was started; no commit, push, deployment, production `seo:prod` or online rollback occurred. Wait for the user's next instruction.

## Source identity and frozen rights

| File | SHA-256 after implementation |
|---|---|
| app/terms-of-service/page.tsx | 8121043E9A474A19A5C1C366ED80E03DB93EC6BC8DC1ED9EDA63EF60D85C83F5 |
| data/game-license-registry.json | FB0B94F56FFA3C7FECA89EE136C73795A95D993DE0EBE16D81CA8041DA4A8924 |
| public/games/square-face.swf | B1D074C95F15B7DCECDBC2405ABF820EAD985669BB12CD47247FC8EA7537BC1E |
| public/games/oval-face.swf | 80E974D8EF4AD5E849E93464EAEA1833620C269BAC30601D960F5438C285E09B |
| components/game-player/GamePlayer.tsx | 142CF22AC3A485C78285D920BBE84114F3931A38F0E9AEC067BBF8CA2E562D5C |

The pre-edit Terms SHA-256 was `5E64E81F600C958B869491C6B801BD94CA71742561CCD9E9BDC09FF6BE8591A4`. Its three-region-masked source hash remains `fbdc5eb48c406ab9e2c779503d89ec93ae5e8821de3fc3e22f8ec29bd1981c6f`.

Square/Oval exact source, rights holder and permissions remain UNKNOWN. Pixel remains DIRECT_LINK_ONLY. The source strings in `lib/locales.ts` and About require separate review; this task does not claim sitewide rights-copy clearance. This is an evidence-consistency implementation, not legal advice or proof of permission.

## Changed files and governance

- Application: `app/terms-of-service/page.tsx`.
- Regression/support: `scripts/check-terms-rights.mjs`, `package.json`, `scripts/README.md`.
- Proposal and legal follow-up: `docs/legal/terms-rights-consistency-proposal.md`, `docs/legal/game-rights.md`.
- Evidence: this README and `checks.json`; `docs/quality/evidence/release-2026-09-02/README.md`.
- Governance: `LAUNCH_CHECKLIST.md`, `PAGE_PLAN.md`, `SEO_LOG.md`.
- Authority: the Liu-library `mysquarefaceicon_rebuild_dashboard.html`, v1.45, TERMS-001 `已完成（本地已验收）`; a source acceptance record contains the user's exact confirmation and local-only scope.
- v1.44 changes only evidence/governance records: this README and `checks.json`, proposal, legal follow-up, release evidence, `LAUNCH_CHECKLIST.md`, `PAGE_PLAN.md`, `SEO_LOG.md` and the authoritative board. The user-added text in the historical source-negative-fixtures row is preserved.
- v1.45 changes the same nine evidence/governance files only: this README and `checks.json`, proposal, legal follow-up, release evidence, `LAUNCH_CHECKLIST.md`, `PAGE_PLAN.md`, `SEO_LOG.md` and the authoritative board. No application/regression implementation is changed; the historical user-added text remains preserved.

## Deployment and rollback

No commit, push, Cloudflare/DNS/config/secret mutation, deployment or `seo:prod` occurred. Branch and HEAD remain `codex/game-platform-rebuild` / `c6d3008`; existing accumulated changes were preserved. No new production SHA/version or production evidence is claimed.

Rollback only this task's three text regions and corresponding checker/package/docs changes; do not reset the dirty worktree or remove the accepted KW-02 sentence. Restoring the old unsupported wording reopens its content blocker. No data migration or online rollback is needed because nothing was deployed. Any later deployment must first resolve all release gates and revalidate its own rollback candidate.
