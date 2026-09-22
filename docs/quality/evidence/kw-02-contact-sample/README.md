# KW-02 `/contact` one-page sample evidence

Status: `单页样例验收通过 / 未部署`. User authorization: `确认 KW-02 单页样例方案`; user acceptance: `KW-02 单页样例验收通过` on 2026-09-02.

## Scope

- Changed only `app/contact/page.tsx` among the 12 mapped KW-02 pages.
- Inserted one normal visible paragraph immediately after the email-address paragraph:
  `To contact My Square Face Icon about a correction, privacy request, or generator problem, include the affected page and enough context for review.`
- Preserved the existing breadcrumb, eyebrow, H1, lead, headings, cards, email link, header/footer, URL, metadata, canonical, schema, robots/index state, sitemap membership, search intent, and responsive CSS.
- Did not edit the remaining 11 mapped pages, commit, push, deploy, run `seo:prod`, or start `MIG-SQUARE-001`.

## Local evidence

- Source assertion: confirmed paragraph occurs once and sits between the email-address paragraph and early-launch inbox note.
- Raw local production `/contact`: HTTP `200`; title `Contact My Square Face Icon | My Square Face Icon`; canonical `https://mysquarefaceicon.com/contact`; H1 count `1`; configured main-content phrase count `3`; paragraph order passed.
- `npm run seo:check`: expected exit `1`; KW-02 mandatory findings changed `12 → 11`, `/contact` disappeared from the failure list, and the existing should-level reminders stayed at `17`.
- `npx tsc --noEmit`: exit `0`.
- `npm run lint`: exit `0`, no warnings or errors.
- `npm run canonical:check` plus all 11 accepted task checks: exit `0`. `game-template:check` retained its known React `fetchPriority` compatibility warning.
- `npm run robots:check`: exit `0`; six blocked and five public-search/user-retrieval decisions.
- `npm run build`: exit `0`; 42 static/generated routes, middleware `26.8 kB`.
- `npm run cf:build`: exit `0`; OpenNext Worker generated and project patch applied. The known Windows compatibility warning remained visible.

## Browser evidence

- Desktop viewport: exact phrase count `3`, one H1, visible paragraph, correct adjacent paragraph order, canonical unchanged, no robots noindex, correct mailto link, and horizontal overflow `0`.
- Mobile `390 × 844`: exact phrase count `3`, one H1, visible readable wrapping, horizontal overflow `0`, and no large fixed obstruction.
- `Back to the generator` navigated to `http://127.0.0.1:3000/#maker`; browser Back restored `/contact` and the count remained `3`.
- Browser console logs: `[]`.

## Release boundary and rollback

Task-level result: `通过，已由用户验收`. Global release result: `不通过 / 未部署`; 11 KW-02 mandatory findings, OP-11 and AI-01 production verification, first-Play INP `221 ms`, and exact Square/Oval license evidence remain open.

Rollback is a single-copy reversal: remove the added paragraph and reverse this task's documentation/board entries. No schema, data, asset, migration, secret, route, index, or production rollback is required because none changed.

The sample acceptance closes only the `/contact` gate. The remaining 11-page batch is separately documented and awaits explicit confirmation in `docs/seo/keyword-coverage-release-proposal.md`.
