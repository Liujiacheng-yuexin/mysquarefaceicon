# KW-02 release-remediation proposal

Status: `KW-02 全批次本地验收通过 / 未部署`.

## Verified finding

After fixing the local-preview origin mapping in `scripts/seo-check.mjs`, all false LINK-01/LINK-03/IA-07 findings disappeared. A fresh local production run after AI-01 acceptance reconfirmed 12 remaining `必须` findings: each page uses its configured exact phrase twice, while KW-02 requires the primary phrase or a natural variant at least three times in main content. The run also retained 17 `应该` reminders; they are not silently included in this blocker.

This is not authorization to insert keywords mechanically. KW-05, KW-07, KW-10 through KW-16 still require natural, incremental, page-specific writing and a one-page sample before a batch.

## Keyword-to-page mapping

| Keyword | URL | Source file | Proposed incremental location |
|---|---|---|---|
| `about My Square Face Icon` | `/about-us` | `app/about-us/page.tsx` | First paragraph under “Why This Site Exists” |
| `contact My Square Face Icon` | `/contact` | `app/contact/page.tsx` | Email section, immediately after the address |
| `editorial policy` | `/editorial-policy` | `app/editorial-policy/page.tsx` | Original Content and Assets paragraph |
| `square face icon gallery` | `/gallery` | `app/gallery/page.tsx` | Existing gallery-example introduction |
| `square face icon guides` | `/blog` | `app/blog/page.tsx` | Existing lead paragraph before Latest Guides |
| `avatar maker without signup` | `/blog/avatar-maker-without-signup` | matching `page.tsx` | Existing lead paragraph |
| `cute profile picture ideas` | `/blog/cute-profile-picture-ideas` | matching `page.tsx` | Existing lead paragraph |
| `how to make a cute Discord profile icon` | `/blog/how-to-make-a-cute-discord-profile-icon` | matching `page.tsx` | Small-sizes section introduction |
| `Discord avatar size` | `/blog/discord-avatar-size-guide` | matching `page.tsx` | Recommended Working Size paragraph |
| `TikTok profile icon ideas` | `/blog/tiktok-profile-icon-ideas` | matching `page.tsx` | Existing lead paragraph |
| `privacy policy` | `/privacy-policy` | `app/privacy-policy/page.tsx` | Opening explanation before Information We Collect |
| `terms of service` | `/terms-of-service` | `app/terms-of-service/page.tsx` | Use of the Tool paragraph |

No title, H1, URL, canonical, schema, robots directive, sitemap membership, page intent, component structure, or existing paragraph will be replaced.

## Required one-page sample gate

Start with `/contact` only. Proposed natural sentence:

> To contact My Square Face Icon about a correction, privacy request, or generator problem, include the affected page and enough context for review.

### Layout boundary

- Insert one normal visible paragraph immediately after the existing email-address paragraph and before the early-launch inbox note.
- Keep the current breadcrumb, eyebrow, H1, lead, two section headings, card grid, header, footer, and responsive CSS unchanged.
- Do not add a new module, reorder the page, or change the first viewport.

### SEO and content boundary

- The sentence gives users concrete information to include in a correction, privacy, or generator request; it is not a standalone keyword line.
- Expected sample result: `/contact` moves from two to three main-content occurrences and the total KW-02 must findings move from 12 to 11.
- Title, description, H1, canonical, Open Graph, Twitter, schema, sitemap membership, index state, search intent, existing paragraphs, and the configured keyword remain unchanged.
- The remaining 11 mapped pages stay untouched until this sample is implemented, checked, and separately accepted.

### Interaction, accessibility, and responsive boundary

- The addition is semantic visible text, not CSS `content`, hidden text, screen-reader-only text, or script insertion.
- Email link, navigation, focus behavior, card interactions, and accessible names remain unchanged.
- Verify desktop and 390px rendering, readable wrapping, and zero horizontal overflow.

### Verification and stop condition

- Run page-specific source/raw-HTML assertions, exact main-content occurrence counting, readability review, TypeScript/lint as applicable, responsive browser review, and the full local `seo:check`.
- If `/contact` does not reach three natural occurrences, introduces a warning/regression, or reads mechanically, stop and revise the sample rather than applying the batch.
- After implementation, update the authoritative board to `KW-02 单页样例待验收` and stop. Apply the other 11 edits only after explicit sample acceptance.
- If an exact phrase is unnatural on any later page, revise that page's configured keyword or document a natural-variant manual pass instead of forcing repetition.

## Confirmed sample implementation

The user explicitly replied `确认 KW-02 单页样例方案` on 2026-09-02. Only `app/contact/page.tsx` was changed: the confirmed visible paragraph was inserted immediately after the email-address paragraph and before the early-launch inbox note. No other mapped page was edited.

- Raw local production HTML: HTTP 200, one H1, canonical `https://mysquarefaceicon.com/contact`, unchanged rendered title, correct paragraph order, and exactly three main-content occurrences of `contact My Square Face Icon`.
- Full local `seo:check`: `/contact` no longer appears under KW-02; the mandatory findings moved from 12 to 11 while the existing 17 should-level reminders remained unchanged. The command therefore still exits 1 and the global release remains `不通过`.
- Engineering gates: `npx tsc --noEmit`, zero-warning `npm run lint`, `canonical:check`, all 11 accepted task checks, `robots:check`, the 42-route Next build, and the Cloudflare/OpenNext build passed. The existing GAME-TPL `fetchPriority` and OpenNext Windows warnings remain visible.
- Browser QA: desktop and `390 × 844` both showed the paragraph, three occurrences, one H1, zero horizontal overflow, no large fixed obstruction, and an empty console log. `Back to the generator` navigated to `/#maker`, and browser Back restored `/contact` with the count still at three.
- No commit, push, deployment, `seo:prod`, remaining-page edit, or `MIG-SQUARE-001` work occurred.

The user explicitly replied `KW-02 单页样例验收通过` on 2026-09-02. The sample gate is closed; this does not by itself authorize edits to the other 11 pages.

## Remaining 11-page batch proposal

Every proposed edit is one visible, page-specific sentence added at the mapped location. Existing imports, components, paragraphs, headings, metadata, URLs, canonicals, schema, robots/index state, sitemap membership, search intent, and interactions remain unchanged.

| URL | Exact proposed sentence | Exact insertion boundary |
|---|---|---|
| `/about-us` | `This page also explains what visitors should know about My Square Face Icon before using the generator, gallery, guides, or community features.` | New paragraph after the first paragraph under “About My Square Face Icon: Why This Site Exists” |
| `/editorial-policy` | `This editorial policy also requires corrections, source notes, and asset claims to remain traceable to the page where they appear.` | New paragraph after the current Original Content and Assets paragraph |
| `/gallery` | `Use this square face icon gallery to compare expression, contrast, and small-size readability before you make a new design.` | New paragraph after “Browse Square Face Icon Gallery Examples” and before the example grid |
| `/blog` | `Use these square face icon guides to choose a workflow, platform-safe crop, or visual direction before opening the generator.` | Append to the existing lead paragraph before “Latest Square Face Icon Guides” |
| `/blog/avatar-maker-without-signup` | `An avatar maker without signup keeps the first step focused: open the tool, try a face, and decide whether the result suits your profile before providing any account details.` | Append to the existing lead paragraph |
| `/blog/cute-profile-picture-ideas` | `Use these cute profile picture ideas as starting points for mood, contrast, and crop-safe composition rather than copying every detail.` | Append to the existing lead paragraph |
| `/blog/how-to-make-a-cute-discord-profile-icon` | `When learning how to make a cute Discord profile icon, test the eyes, mouth, and hair shape at a small preview before adding minor accessories.` | Append to the first paragraph under the Small Sizes section |
| `/blog/discord-avatar-size-guide` | `Checking Discord avatar size at a small preview also helps confirm that the centered face remains clear after the interface scales it down.` | Append to the first paragraph under “Recommended Discord Avatar Working Size” |
| `/blog/tiktok-profile-icon-ideas` | `Treat these TikTok profile icon ideas as visual directions: choose one mood, one readable expression, and a simple color relationship before adding details.` | Append to the existing lead paragraph |
| `/privacy-policy` | `This privacy policy explains what information is provided through public comments, how moderation uses it, and which details are not shown publicly.` | New paragraph after the Ruffle introduction and before “Privacy Policy: Information We Collect” |
| `/terms-of-service` | `Read these terms of service before using a generated icon, submitting a comment or image, or relying on the tool for a particular browser workflow.` | Append to the current “Terms of Service: Use of the Tool” paragraph |

### Batch boundary and verification

- The 11 sentences are normal server-rendered visible text; no CSS `content`, hidden text, screen-reader-only text, or script insertion is allowed.
- Each page must be reviewed independently for readable flow and exact insertion position; a failing page stops the batch rather than being forced through.
- Raw local production HTML must show one H1, unchanged title/canonical/index boundary, and at least three configured main-content occurrences on all 11 pages.
- Run page-source assertions, `npx tsc --noEmit`, zero-warning lint, relevant task checks, Next build, Cloudflare/OpenNext build, full local `seo:check`, and responsive browser sampling of trust, hub, article, and legal templates.
- Expected KW-02 result is `11 → 0` mandatory findings, but this is not recorded as passed until a real post-change run proves it. All should-level findings remain independently visible.
- After implementation, update the board to `KW-02 剩余 11 页待验收` and stop before commit, push, deployment, `seo:prod`, PF-01, or `MIG-SQUARE-001`.

## Confirmed batch implementation

The user explicitly replied `确认 KW-02 剩余 11 页批量方案，进行开发` on 2026-09-02. Each confirmed sentence was added once at its specified boundary in the 11 mapped source files. The accepted `/contact` sample was preserved, and no metadata, URL, H1, canonical, schema, robots/index state, sitemap membership, component, interaction, or CSS change was included.

- Final source assertions passed for all 11 exact sentences and insertion boundaries. The accepted `/contact` sentence remained present once. The existing Terms `authorized SWF` and generated-output paragraphs remained byte-for-byte in scope and were not rewritten.
- Raw local production HTML passed on all 12 mapped routes: HTTP `200`, one H1, expected production canonical, no `noindex`, each configured main-content phrase exactly three times, and each accepted sentence exactly once.
- Local `seo-check` exited `0`: KW-02 mandatory findings changed `11 → 0`. Twelve independent should-level reminders remain: one KW-03 low-density observation, seven META-03 title-length reminders, and four META-04 description-length reminders.
- `npx tsc --noEmit`, zero-warning `npm run lint`, `canonical:check`, all 11 accepted task checks, `robots:check`, the 42-route Next build, and Cloudflare/OpenNext build passed. The known GAME-TPL `fetchPriority` and OpenNext Windows warnings remain visible.
- Desktop `1280 × 900` and mobile `390 × 844` browser sampling covered trust, Gallery hub, article, Privacy, and Terms templates. All sampled pages kept one H1, the expected canonical, three phrase occurrences, visible confirmed text, zero horizontal overflow, and no large fixed obstruction. Terms → Contact → browser Back passed, and browser warning/error logs were empty.
- No commit, push, deployment, `seo:prod`, PF-01 change, or `MIG-SQUARE-001` work occurred during implementation.

The user explicitly replied `KW-02 剩余 11 页验收通过` on 2026-09-02. This accepts the remaining batch locally and closes KW-02 together with the previously accepted `/contact` sample. It does not convert local checks into production evidence, accept the 12 should-level reminders as resolved, authorize a deployment, or close PF-01 and the separate Terms/license conflict.

### Existing legal-copy conflict kept separate

`/terms-of-service` currently says the SWF is authorized and permits personal use of generated icons, while the accepted License Registry keeps exact Square/Oval source, public-performance permission, and generated-output use at `UNKNOWN`. The KW-02 batch sentence above does not repeat or silently rewrite those claims. They remain a separate visible release blocker requiring an explicitly confirmed user-facing legal-copy repair.

Batch approval phrase: `确认 KW-02 剩余 11 页批量方案，进行开发`.

Batch acceptance phrase: `KW-02 剩余 11 页验收通过`.
