# Ruffle runtime operations

> RUFFLE-001 · 2026-09-08  
> Runtime status: locally governed, awaiting user acceptance  
> Release status: not deployed

## Locked runtime

The site self-hosts the JavaScript and WebAssembly runtime from the installed npm package. The package, lockfile, manifest and public copy must all remain on exactly `@ruffle-rs/ruffle@0.2.0-nightly.2026.5.12`. The browser entry is `/ruffle/ruffle.js`; the adapter has no CDN fallback and sets `publicPath` to `/ruffle/`.

| Public file | Bytes | SHA-256 | Cache policy |
|---|---:|---|---|
| `ruffle.js` | 455,299 | `0f320b07abc9a000a5e9d445eaec8df05d8607351bc3248ef5552f943ba5b7ea` | revalidate |
| `core.ruffle.549e09f5ab25b1ddd637.js` | 110,264 | `b1c9f536332a91f3af74ce4dc954774383abc1df485ba1be331c44fba85eaa86` | one year, immutable |
| `core.ruffle.c736d9febaa371cbf8ce.js` | 102,936 | `c568b9a9a9a1842eb0bb5fbef9468291c410dc56d535338da9fb81fa471b5803` | one year, immutable |
| `5ab714cfe6d10dcc7003.wasm` | 13,878,361 | `575a14c02e47dcf34d61a2de684783994f29a60046361cd950c37a9feb10df9a` | one year, immutable |
| `9e3e2a04bfe37ff3e3e9.wasm` | 12,965,837 | `6e2b664d1a5f4b9f0acaf51cc94caa2460d3920a5584611075a250475ffa0c25` | one year, immutable |

The two WASM files are served as `application/wasm`; JavaScript files are served as `application/javascript; charset=utf-8`. The service worker does not prefetch Ruffle or SWF files. It uses network-first with cache fallback for `ruffle.js`, and runtime cache-first behavior for the content-hashed children.

## Routine verification

Run the read-only gate before reviewing a build:

```powershell
npm run ruffle:check
node scripts/check-ruffle-runtime.mjs --base http://127.0.0.1:3100
```

`build`, `cf:build` and `cf:deploy` run this gate first. They deliberately do not repair drift. If the public copy needs to be reconstructed from the already installed package, run the explicit offline sync and inspect its result:

```powershell
npm run ruffle:sync
npm run ruffle:check
git diff -- package.json package-lock.json data/ruffle-runtime-manifest.json public/ruffle
```

The sync allowlist excludes source maps, package documentation, licenses and every file under `public/games/`. Extra files in `public/ruffle/` cause a failure rather than silent deletion.

## Upgrade procedure

1. Open a dedicated change; do not absorb an upgrade into unrelated work.
2. Choose one exact Ruffle version and install that exact version, without `^`, `~` or `@latest`.
3. Review the installed package name, declared license and runtime file set.
4. Update `data/ruffle-runtime-manifest.json` with the new version, filenames, byte lengths and SHA-256 values.
5. Run `npm run ruffle:sync`, inspect every public-file change, then run `npm run ruffle:check`.
6. Run type, lint, Next and OpenNext builds plus the existing player, homepage and Oval regression suites.
7. In a local production server, verify every manifest URL for status, body hash, MIME and cache header.
8. Test Square and Oval independently: before Play no runtime/SWF request; after Play only same-origin runtime and that game's SWF; loading reaches ready; Reload works; error can be retried; no relevant console error.
9. Repeat the rendered checks at desktop and mobile widths. Record any unverified in-game operation, fullscreen behavior or browser engine explicitly.
10. Obtain user acceptance before commit, push, deployment or the next board task.

## Rollback procedure

1. Restore the previous exact dependency and `package-lock.json` entry.
2. Restore the previous manifest and all five matching public runtime files.
3. Restore the matching Ruffle adapter and response-header behavior if the upgrade changed them.
4. Change the service-worker cache name so clients activate the restored contract; keep `ruffle.js` revalidating.
5. Run `npm ci`, `npm run ruffle:check`, the Square/Oval regressions and both builds.
6. After an authorized deployment, verify both game routes and all runtime responses on production before calling the rollback successful.

## Rights and release boundary

Ruffle's installed package declares `(MIT OR Apache-2.0)`. That package declaration does not grant, prove or change rights to `square-face.swf`, `oval-face.swf`, covers, artwork or game content. The project registry still records the applicable SWF rights as `UNKNOWN`. This procedure does not decompile or modify either SWF, and local success is not production acceptance or deployment authorization.
