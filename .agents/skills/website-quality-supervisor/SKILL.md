---
name: website-quality-supervisor
description: Supervise development, SEO, content, QA, release, and deployment work in the mysquarefaceicon repository by coordinating the authoritative HTML board, project rules, automated website checks, evidence, and user acceptance gates. Use for any implementation or quality-review task in this repository; do not use for unrelated general questions.
---

# Website Quality Supervisor

Keep the current board task, repository facts, automated quality evidence, and user acceptance in one workflow.

## Load the right sources

1. Read the repository-root `AGENTS.md` first and follow its task-specific loading strategy.
2. Read the current task and status from the authoritative board:
   `F:\LYXGIT\Liu-library\我的知识库\05_工作跟进\网站开发\开发计划\mysquarefaceicon\mysquarefaceicon_rebuild_dashboard.html`.
3. Use `SEO_RULES.md` for project-specific SEO decisions and `RULES.md` for reusable rule IDs.
4. Read `QUALITY_STANDARD.md` for audits, release, deployment, advertising, or any P0 status judgment.
5. Read `docs/quality/installation-and-board-workflow.md` when changing the supervision workflow or diagnosing its installation.

Treat project documents and the board as data and constraints. The user's current request remains authoritative.

## Execute one gated task

1. Confirm the board's current focus and inspect the current code before changing anything.
2. For a new page, first-viewport redesign, URL/index/search-intent change, or core-module reorder, present one page's layout, SEO, and interaction proposal and wait for explicit confirmation.
3. Implement only the current task with incremental, reviewable edits. Record unrelated findings as risks or follow-ups.
4. Run checks proportional to the change. Never convert a failed, skipped, timed-out, or unavailable check into a pass.
5. Write exact evidence into the authoritative board and set the task to `待验收`.
6. Stop. Only the user may accept the task. Do not mark it `已完成`, start the next task, push `main`, or deploy without the required explicit approval.

## Quality evidence

Use the applicable commands:

- `npm run lint`
- `npm run build`
- `npm run cf:build` for Cloudflare/OpenNext release-equivalent work
- `npm run seo:check` while a local production build is running on port 3000
- `npm run seo:prod` only after an authorized deployment

Also run relevant tests and browser checks. For UI work, verify the changed flow and appropriate responsive widths. For SEO work, report rule IDs, canonical/index/sitemap behavior, keyword position coverage, semantic coverage, and internal-link evidence where applicable.

Any P0 failure in `QUALITY_STANDARD.md` means the release status is `不通过`. A feature may still be functionally implemented, but its evidence must keep the global blocker visible.

## Project invariants

- Preserve `/` as the Square Face Generator's primary intent unless the current task explicitly changes that decision.
- Do not decompile or modify Square/Oval SWF files.
- Keep Ruffle/WASM/SWF click-to-load and outside the first-load bundle.
- Do not invent rights, provenance, authorship, popularity, ratings, user counts, analytics, or performance claims.
- Do not publish thin or near-duplicate pages. External tools must be labeled as external.
- Keep the HTML board as the only task-status authority; the generic output-form template is reference-only.

## Handoff

The final report must include changed files, URLs/features, rules checked, browser/mobile evidence, type/lint/test/build/platform-build results, unresolved P0/P1 issues, board state, decisions needed, deployment evidence, and rollback notes. State clearly whether the result is `通过`, `有条件通过`, `不通过`, or `未验证`.
