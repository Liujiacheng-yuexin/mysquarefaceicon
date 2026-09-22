# Website Quality Supervisor installation and board workflow

## Installation record

- Installed: 2026-08-31
- Source: `F:\LYXGIT\Liu-library\我的知识库\03_可复用资产\模板\网站\1.建站必装`
- Source specification version: `2026-08-31` (`v2.1`)
- Scope: repository-level development, SEO, content, quality, release, and deployment supervision
- Status: installed and accepted by the user with `AUDIT-001` on 2026-08-31

The source package is a website-governance template, not a standalone `SKILL.md`. It was adapted into the repository-scoped skill `.agents/skills/website-quality-supervisor/SKILL.md`, which Codex can discover from the repository.

## Conflict-safe mapping

| Source item | Project destination | Decision |
|---|---|---|
| `RULES.md` | `RULES.md` | Installed; reusable rule IDs and severity levels |
| `STRATEGY.md` | `STRATEGY.md` | Installed; strategic background |
| `QUALITY_STANDARD.md` | `QUALITY_STANDARD.md` | Installed; P0 gates and evidence states |
| `README.md` | `SEO_GUIDE.md` | Installed and adapted to root-level project documents |
| `CHANGELOG.md` | `CHANGELOG.md` | Installed as the reusable specification changelog |
| `scripts/*` | `scripts/*` | Installed as executable, zero-dependency checks |
| `prompts/*` | `prompts/*` | Installed for optional user-triggered workflows |
| source `AGENTS.md` | merged into root `AGENTS.md` | Existing project-specific rules were preserved |
| source `STYLE_GUIDE.md` | `docs/quality/STYLE_GUIDE.template.md` | Reference only; existing `STYLE_GUIDE.md` remains authoritative |
| source project templates | existing root project documents | `PROJECT_BRIEF.md`, `PAGE_PLAN.md`, `CONTENT_PLAN.md`, `SEO_PLAN.md`, `SEO_LOG.md`, and `LAUNCH_CHECKLIST.md` were preserved |
| `创建输出表单.md` | `docs/quality/创建输出表单.template.md` | Reference only; the authoritative HTML board replaces it |
| `LESSONS.md` | not installed | Remains in the Liu-library knowledge base as required by the source kit |

## Authoritative board

`F:\LYXGIT\Liu-library\我的知识库\05_工作跟进\网站开发\开发计划\mysquarefaceicon\mysquarefaceicon_rebuild_dashboard.html`

The board and quality supervisor cooperate as follows:

1. Read the current board task and its acceptance criteria.
2. Inspect current code and relevant project documents.
3. Obtain the required page/layout confirmation before gated design work.
4. Implement only the current task.
5. Run the applicable checks and capture exact commands, environment, results, and gaps.
6. Update the board evidence and set the task to `待验收`.
7. Wait for the user to choose `验收通过` or `退回开发`.
8. Only after explicit acceptance may the board show `已完成` and the next task begin.

Passing automation never substitutes for user acceptance. Conversely, user acceptance does not turn a failed P0 release gate into a pass; the failure remains visible until fixed and rechecked.

## Command matrix

| Scope | Required evidence when applicable |
|---|---|
| Code change | `npm run lint`, relevant tests, `npm run build` |
| Cloudflare/OpenNext release | `npm run cf:build`, version linkage, rollback notes |
| Local SEO audit | start a production build on port 3000, then `npm run seo:check` |
| UI or interaction | browser flow plus relevant mobile/desktop widths |
| Authorized deployment | commit/push/deployment version, production smoke, then `npm run seo:prod` |
| SEO/content/page change | rule IDs, canonical/index/sitemap, keyword and semantic coverage, internal links, `SEO_LOG.md` |

## Current known blockers and decisions

- `app/sitemap.ts` contains an existing uncommitted invalid edit; lint and build fail before the new SEO checker can crawl a local production build.
- The live regression check confirms robots/sitemap/noindex/OG checks pass, but plain HTTP returns `200` instead of redirecting to HTTPS (`OP-03`, P0).
- The source post-deploy script originally treated `Disallow: /` in named AI-crawler groups as a wildcard block. The project copy now parses robots groups and no longer reports that false positive.
- A five-page production probe of `seo-check` completed after the parser fix. It found three mandatory `KW-02` findings on `/contact`, `/about-us`, and `/editorial-policy`, plus five should-level warnings covering density, inbound links, title length, and description length. This validates the checker but is not the complete `BASE-001` baseline.
- The project has no automated test script. This is reported as unavailable, never as passed.
- The user confirmed the AI-01 split policy on 2026-09-02. `PROJECT_BRIEF.md` now records each crawler decision; source implementation and local/production verification remain separate acceptance and release evidence gates.
- Game license/provenance evidence is incomplete and remains a release/content-expansion gate.
- The user accepted `BASE-001` and explicitly selected the v2.1 SEO migration on 2026-08-31. `SEO_RULES.md`, `TECH_RULES.md`, `CONTENT_PLAN.md`, and `LAUNCH_CHECKLIST.md` now use `RULES.md` IDs instead of the retired `3%-5%` density target.
- No commit, push, deployment, IndexNow submission, or production mutation is authorized by installing this supervisor.

## Installation verification · 2026-08-31

| Check | Result |
|---|---|
| Skill frontmatter/name/description/TODO validation | Passed by an equivalent local validation; the bundled `quick_validate.py` could not start because both available Python environments lack `PyYAML` |
| `scripts/seo-check.mjs` syntax | Passed `node --check` |
| `scripts/post-deploy-check.mjs` syntax | Passed `node --check` |
| `seo-check.config.json` and `package.json` parsing | Passed |
| Board JavaScript syntax | Passed `node --check` after extracting the inline script |
| Board browser QA | Passed at 1280×720: v1.2 loaded, `AUDIT-001` stayed `待验收`, quality panel rendered, help dialog opened/closed, and no console warning/error was logged |
| `npm run quality:code` | Failed at lint because of the pre-existing `app/sitemap.ts` parse error; build was run separately and failed at the same file |
| Local `npm run seo:check` | Blocked because no valid production build can start until `app/sitemap.ts` is resolved |
| Production `seo:prod` read-only probe | Robots, sitemap (20 URLs), sampled noindex, and OG image passed; OP-03 HTTP→HTTPS failed |
| Production `seo-check` five-page probe | Checker ran successfully; 3 mandatory and 5 should-level findings remain open |
