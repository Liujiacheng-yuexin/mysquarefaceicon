# OP-11 canonical-host normalization proposal

Status: `已实施并验收（本地） / 生产未验证`; the source implementation is local only and no commit, push, deployment, DNS rule, or Cloudflare setting has been changed.

## Current evidence

The 2026-09-01 production probe returned `200` for every root variant instead of normalizing to the canonical origin:

| Request | Current result | Required result |
|---|---:|---|
| `http://mysquarefaceicon.com/` | `200` | one-hop `308` to `https://mysquarefaceicon.com/` |
| `http://www.mysquarefaceicon.com/` | `200` | one-hop `308` to `https://mysquarefaceicon.com/` |
| `https://www.mysquarefaceicon.com/` | `200` | one-hop `308` to `https://mysquarefaceicon.com/` |
| `https://mysquarefaceicon.com/` | `200` | remain `200` |

This is an existing P0 release blocker under `OP-11`. The site's existing canonical metadata already uses the HTTPS apex origin, so the change enforces the declared canonical origin rather than moving an indexed path or changing search intent.

The table above remains the evidence for the currently deployed Worker. After the user replied `继续任务`, the recommended bounded proposal was implemented locally on 2026-09-02. Production is still unverified until a later authorized deployment.

The user explicitly replied `OP-11 验收通过，继续下一发布阻断项` on 2026-09-02. This closes the source acceptance gate and opens AI-01 for policy confirmation; it does not authorize deployment or close the live-origin verification gate.

## Proposed behavior

- Add a production-host-only edge request guard in the Next/OpenNext application.
- Use permanent `308` responses so the HTTP method and request body are preserved.
- Normalize both scheme and host in a single hop to `https://mysquarefaceicon.com`.
- Preserve the complete path and query string; for example, `http://www.mysquarefaceicon.com/gallery?ref=x` becomes `https://mysquarefaceicon.com/gallery?ref=x`.
- Do not redirect `localhost`, preview hosts, or unrelated custom hosts.
- Do not change any page path, title, H1, canonical target, robots directive, sitemap membership, schema, or search intent.

## Implementation result

- The production-host-only guard is implemented in `middleware.ts` and delegates to the pure decision helper in `lib/seo/canonical-origin.ts`.
- The destination is fixed to the HTTPS apex; only the two exact production hostnames are accepted, preventing an arbitrary Host header from becoming an open redirect.
- The isolated `npm run canonical:check` matrix and a real local Next production HTTP matrix pass, including rewritten proxy authority, nested path/query, POST `308`, canonical pass-through, preview pass-through, and localhost pass-through.
- `scripts/post-deploy-check.mjs` now asserts the complete OP-11 production matrix and rejects a second redirect hop.
- Full evidence is in `docs/quality/evidence/op-11-canonical-host/README.md`.

## Verification gate

Before production deployment:

1. Unit-check the host/protocol decision matrix, including path and query preservation.
2. Run type-check, lint, framework build, Cloudflare/OpenNext build, all accepted task checks, and local production SEO checks.
3. Confirm local preview hosts are not redirected.

Immediately after deployment:

1. Assert the four root variants above and at least one nested path complete in zero or one redirect.
2. Run `npm run seo:prod`.
3. Browser-check `/`, `/oval-face-icon-generator`, `/pixel-art-avatar-icon-generator`, a real 404, `robots.txt`, and `sitemap.xml` at desktop and mobile widths.
4. Re-run mobile performance evidence and roll back if a P0 regression is observed.

## Rollback

- Source rollback: remove the production-host request guard and redeploy the preceding commit.
- Production rollback target before this release: Worker version `4f1b0c0c-d984-45ba-9620-e0add7244331` (reconfirm immediately before rollback).
- No KV, R2, D1, URL-path, content, or schema migration is involved.

Acceptance record: `OP-11 验收通过，继续下一发布阻断项` (2026-09-02).
