# AGENTS.md

This is an SEO-focused web tool project for `mysquarefaceicon.com`.

## Required project context

Before development, SEO edits, new pages, launch checks, content work, or quality reviews, read:

1. `PROJECT_BRIEF.md`
2. `SEO_RULES.md`
3. `RULES.md`
4. `STYLE_GUIDE.md`
5. `PAGE_PLAN.md`
6. `LAUNCH_CHECKLIST.md`
7. `CONTENT_PLAN.md`

For post-launch growth, also read `SEO_PLAN.md` and `SEO_LOG.md`. For release, deployment, advertising, or a full quality audit, also read `QUALITY_STANDARD.md`. Read `STRATEGY.md` for initial planning or a material product/SEO direction change.

`SEO_RULES.md` contains project-specific SEO decisions. `RULES.md` is the installed reusable quality rule set. If they differ, preserve the project-specific decision unless it violates a P0 safety, indexing, privacy, or release gate; report the conflict and request a user decision.

## Authoritative development board and acceptance gate

The authoritative board is:

`F:\LYXGIT\Liu-library\我的知识库\05_工作跟进\网站开发\开发计划\mysquarefaceicon\mysquarefaceicon_rebuild_dashboard.html`

- Start from the board's current focus and execute one task at a time.
- Before implementation, reconcile the task with current code and project documents.
- New pages, first-viewport redesigns, URL/index changes, search-intent changes, and core module reordering require a one-page layout/SEO/interaction proposal and explicit user confirmation before coding.
- After implementation, update the board with concrete evidence and set the task to `待验收`.
- Never mark a task `已完成`, start the next task, push `main`, or deploy because checks passed. Wait for the user's explicit acceptance.
- A failed or skipped P0 check stays visible as a blocker; do not hide it behind partial success.
- The HTML board replaces the generic `创建输出表单` task tracker. Do not maintain a second competing status table.

## Installed quality supervisor

The repository-scoped skill is `.agents/skills/website-quality-supervisor/SKILL.md`. It coordinates this board with the reusable quality standards and the automated checks:

- `npm run seo:check` against a running local production build
- `npm run seo:prod` after an authorized deployment
- `npm run lint`, `npm run build`, and `npm run cf:build` when relevant
- browser checks for changed flows and responsive widths

The reusable kit was adapted from the `2026-08-31` version of `1.建站必装`. Installation mapping and known blockers are recorded in `docs/quality/installation-and-board-workflow.md`.

## Project rules

- Do not rely only on chat history when project documents exist.
- Do not copy competitor SWF files, images, comments, copy, or downloadable assets.
- Do not decompile or modify the Square/Oval SWF files.
- Keep the core tool visible in the first viewport.
- Preserve SEO, performance, accessibility, and mobile usability over decorative effects.
- Do not create low-quality thin pages, near-duplicate pages, or doorway pages.
- Do not invent licensing, authorship, originality, user counts, popularity, ratings, or performance results.
- Update `SEO_LOG.md` after SEO-related changes; installation-only or audit-only work must state why no production SEO entry was needed.

## Final work summary

Include changed files, completed pages or features, affected URLs, rule/SEO checks, mobile/visual checks, type/lint/test/framework build/platform build results, unresolved issues, user decisions needed, board status/evidence, deployment evidence, and rollback notes. Distinguish `通过`, `有条件通过`, `不通过`, and `未验证` according to `QUALITY_STANDARD.md`.
