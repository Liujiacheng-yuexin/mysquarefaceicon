# BACKUP-001 Rebuild Baseline and Rollback Plan

Snapshot date: `2026-08-31` (Asia/Shanghai)

## Scope and default decision

This baseline protects the current public page routes and production metadata before the game-platform rebuild. The authoritative URL snapshot is `docs/migration/url-freeze.csv`.

- All 30 source-backed public page routes were fetched from production over HTTPS.
- All 30 returned HTTP `200` without a path redirect.
- 20 routes are indexable and present in the production sitemap.
- 10 routes are explicitly `noindex`: seven unreviewed locale pages, two auxiliary keyword pages, and the comment moderation page.
- Existing indexable URLs, titles, canonicals, and indexability remain unchanged by default.
- A URL move, redirect, canonical target change, or indexability change requires its own user-approved proposal. No `301` is pre-authorized by this task.
- API routes are outside the page freeze because they do not expose page metadata and `/api/` is disallowed in `robots.txt`; the existing route inventory remains in `docs/audit/current-architecture.md`.

`INDEXABLE` in the CSV describes the observed production directives. It does not claim that Google has individually indexed every listed URL. The accepted BASE-001 evidence records an aggregate GSC count of 20 indexed pages.

## Git rollback identifiers

| Item | Value | Evidence strength |
| --- | --- | --- |
| Rebuild branch | `codex/game-platform-rebuild` | Verified locally |
| Branch base / `origin/main` | `a1a2c9df94fb51fced7c39406de28c7e306379c7` | Verified with local and remote-tracking refs |
| Branch-base commit time | `2026-07-22T00:05:50+08:00` | Verified from Git |
| Existing production Git tag | None | Verified: repository had no tags at snapshot time |
| Local rebuild baseline tag | `rebuild-baseline-2026-08-31` | Created locally after the baseline commit; not pushed |

The local tag is the recoverable source baseline for future rebuild commits. Verify it before a rollback with:

```powershell
git rev-parse rebuild-baseline-2026-08-31
git show --stat --oneline rebuild-baseline-2026-08-31
```

The pre-existing uncommitted `app/sitemap.ts` change is deliberately excluded from the baseline commit and tag. It replaces the sitemap source with unrelated keyword text and is the known build blocker. The file remains untouched in the working tree so no user-owned work is lost; the tag retains the last committed sitemap implementation.

## Production Worker rollback identifiers

Read-only Wrangler inspection with version `4.90.1` reported:

| Item | Value |
| --- | --- |
| Worker | `mysquarefaceicon` |
| Active deployment ID | `0340bd09-0ccb-4733-84b9-5a7cf57e9edf` |
| Active Worker version | `43` |
| Active Worker version ID | `4f1b0c0c-d984-45ba-9620-e0add7244331` |
| Traffic allocation | `100%` |
| Deployment time | `2026-07-21T16:09:36.676634Z` |
| Source | `wrangler` |

Wrangler's version metadata contains no Git SHA. The active deployment occurred about four minutes after commit `a1a2c9d...` and that commit is still `origin/main`, so it is the strongest available production-source candidate, but the association is **inferred rather than cryptographically verified**. Future deployments should attach a release tag or commit annotation so this ambiguity does not recur.

Cloudflare Worker versions cover Worker code, configuration, static assets, and bindings. They do not snapshot data stored in KV, R2, or D1. This project uses `COMMENTS_KV` and `COMMENT_IMAGES_R2`; this task creates no storage backup and authorizes no data mutation.

## Rollback procedure

### Source rollback before deployment

1. Stop new changes and record the failing commit plus affected URLs.
2. Compare the change with `rebuild-baseline-2026-08-31` and the CSV freeze.
3. Prefer `git revert <bad-commit>` so history remains auditable. Do not use `git reset --hard` against the user's working tree.
4. If an isolated recovery checkout is needed, create a new branch from the tag:

   ```powershell
   git switch -c codex/recovery-YYYYMMDD rebuild-baseline-2026-08-31
   ```

5. Re-run applicable lint, build, platform build, SEO, browser, and mobile checks before any release request.

### Production Worker rollback after an authorized deployment

1. Obtain explicit deployment/rollback authorization and confirm the target version is still available.
2. Check whether the failed release changed KV/R2/D1 data or binding compatibility. A Worker rollback does not reverse storage state.
3. Roll back code to the recorded baseline Worker version only when compatible:

   ```powershell
   npx wrangler rollback 4f1b0c0c-d984-45ba-9620-e0add7244331 --message "Rollback to BACKUP-001 production baseline"
   ```

4. Verify the active deployment, then run production SEO checks and browser acceptance for `/`, `/oval-face-icon-generator`, `/pixel-art-avatar-icon-generator`, sitemap, robots, and every URL affected by the failed release.
5. Compare status, title, canonical, robots directives, and sitemap membership with `url-freeze.csv`. Keep any mismatch visible as a release blocker.

## Evidence and limitations

- Production checks were read-only; no Worker version, traffic allocation, KV value, R2 object, URL, redirect, or index directive was changed.
- The production sitemap returned `200` and exactly 20 URLs, matching the 20 indexable rows in the freeze table.
- The production `robots.txt` returned `200`, allows public pages, and disallows `/admin/` and `/api/` in the project-managed group.
- The HTTP-to-HTTPS root redirect remains a known P0 failure from the accepted quality baseline and is not fixed by BACKUP-001.
- No push or deployment is part of this baseline task.
