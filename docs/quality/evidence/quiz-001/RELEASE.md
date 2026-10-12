# QUIZ-001 release record

Date: 2026-10-12 (Asia/Shanghai). The user explicitly requested `提交并部署` after the local delivery. This authorizes committing the scoped QUIZ-001 changes on `main`, pushing normally, and deploying through `npm run cf:deploy`.

## Candidate and checks

- Base commit: `1d275c678a1e15170a8e836b2c540ab3c68ea8f6`; `main` and `origin/main` matched before release.
- All 61 implementation-file SHA-256 values still match [the validated fingerprint](implementation-fingerprint.json). No unrelated working-tree files were found.
- The matching implementation passed type/lint, all 31 applicable offline checks, Next and Cloudflare builds, local SEO, HTTP/assets, four viewport round trips, touch emulation and keyboard/error recovery. See [local delivery](DELIVERY.md).
- The deployment command rebuilds the exact committed source. Its Worker annotation will contain the source commit.
- No new dependencies, backend resources or bindings; no changes to the Square/Oval SWF files or previous rights facts.

## Production evidence

This file is written before committing and does not claim that deployment has succeeded. The final commit, push, Worker version, production SEO, HTTP and browser evidence will be saved in the authoritative HTML board and this release receipt directory:

`C:/Users/liu/.codex/visualizations/2026/10/12/01a13010-c102-71b3-876d-6bacaa8d5aa9/quiz-001-release/`

Keeping the post-deployment receipt outside the repository lets it describe the deployed commit without producing a second, undeployed source revision.

Production verification covers the new detail page, the noindex category and raw game entry, the complete sitemap, existing noindex pages, real 404 responses, assets, canonical-host redirects and a fresh-browser quiz/result round trip. IndexNow and GSC writes are outside this release instruction.

## Retained limitations

The user's release instruction supersedes the earlier local-only authorization. It is not evidence of a ten-result SERP review, a separately documented human content review, physical-phone/Safari or screen-reader testing, field CWV, indexing, rankings or verified rights for legacy games. Those remain unverified or UNKNOWN. Existing SEO reminders remain recorded. The board remains `待验收`; release does not silently mark it `已完成` or start another task.

## Rollback

Immediately before release, Cloudflare reported active Worker version `1afa718a-8953-4f90-8f3b-493fbe5493b0` at 100% traffic, deployment `f2455753-42ad-41c0-bbe4-2e11b36c03d6`. The read-only snapshot is `deployments-before.json` in the receipt directory.

If a confirmed production regression requires rollback, verify that version is still available, use the normal Wrangler rollback procedure with appropriate authorization, and repeat production SEO and core-flow checks. Worker rollback does not restore KV/R2 data; this release performs no data migration. Source recovery uses a normal revert of the QUIZ-001 release commit, never a force-push or destructive reset.
