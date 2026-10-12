import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { modules, scriptHarness } from "./category-sample-test-utils.mjs";
import { beforeFriendQuizFixesSource } from "./friend-quiz-fixes-compat.mjs";
import { protectBannerWorker } from "./banner-worker-policy.mjs";

const bootstrap = modules().load("lib/games/friend-quiz-bootstrap.ts").friendQuizBootstrap;
for (const pathname of ["/games/friend-block-test", "/games/friend-block-test/", "/games/%66riend-block-test", "/games/friend%2Dblock%2Dtest"]) {
  const original = "#fbt1.private-test-content.checksum", events = new Map(), sent = [], scripts = [];
  const location = new URL("https://mysquarefaceicon.com" + pathname + original);
  const context = { URL, Set, location, history: { state: { next: true }, replaceState(state, _title, url) { assert.deepEqual(state, { next: true }); location.href = new URL(url, location).href; } }, document: { referrer: "https://example.test/source#private", createElement: () => ({}), head: { appendChild: script => scripts.push(script) } }, addEventListener: (name, fn, capture) => events.set(name, { fn, capture }), postMessage(data, targetOrigin) { sent.push({ recipient: this, data, targetOrigin }); } };
  context.window = context;
  vm.runInNewContext(bootstrap, context);
  assert.equal(location.hash, "");
  assert(context.__MSFI_FRIEND_QUIZ__.hasSharedLink());
  assert(!JSON.stringify(context.__MSFI_FRIEND_QUIZ__).includes(original));
  const target = {}, frame = { src: location.origin + "/games/friend-block-test/index.html", contentWindow: target };
  context.__MSFI_FRIEND_QUIZ__.connect(frame);
  assert.equal(sent.length, 1); assert.equal(sent[0].recipient, target);
  assert.equal(sent[0].data.fragment, original); assert.equal(sent[0].targetOrigin, location.origin);
  context.__MSFI_FRIEND_QUIZ__.connect({ src: "https://example.test/game", contentWindow: {} });
  assert.equal(sent.length, 1, "No private handoff to another origin");
  context.__MSFI_FRIEND_QUIZ__.connect(frame);
  let notified = 0, stopped = false;
  const unsubscribe = context.__MSFI_FRIEND_QUIZ__.subscribe(() => notified++);
  location.hash = "#fbt1.second-content.checksum";
  events.get("hashchange").fn({ stopImmediatePropagation() { stopped = true; } });
  assert.equal(location.hash, ""); assert(stopped); assert.equal(notified, 1); assert.equal(events.get("hashchange").capture, true);
  assert.equal(sent.at(-1).data.fragment, "#fbt1.second-content.checksum");
  unsubscribe(); context.__MSFI_FRIEND_QUIZ__.reset(); assert.equal(context.__MSFI_FRIEND_QUIZ__.hasSharedLink(), false);

  const inline = readFileSync("app/layout.tsx", "utf8").match(/__html: (`[\s\S]*?`)/)[1];
  vm.runInNewContext(vm.runInNewContext(inline, { googleAnalyticsId: "fixture" }), context);
  assert.equal(scripts.length, 1);
  const config = context.dataLayer.find(row => row[0] === "config")[2];
  assert.equal(config.page_location, "https://mysquarefaceicon.com/games/friend-block-test");
  assert(!JSON.stringify(context.dataLayer).includes("fbt1."));
  assert.equal(context.adsbygoogle.requestNonPersonalizedAds, 1);
  const h = scriptHarness(pathname, "complete", { __MSFI_FRIEND_QUIZ__: {} });
  h.wait(); h.event("pointerdown"); assert.equal(h.ads().length, 1); assert.equal(h.scripts.length, 2); h.unmount();
}
console.log("PASS fragment captured before telemetry, local-only handoff, hash/popstate privacy guard, sanitized GA, deferred AdSense/beacon and encoded routes");

const worker = `export default {\n    async fetch(request, env, ctx) {\n        return runWithCloudflareRequestContext(request, env, ctx, async () => {\n            return upstream;\n        });\n    },\n};\n`;
for (const pathname of ["/games/friend-block-test", "/games/%66riend-block-test"]) {
  const upstream = new Response("public quiz page", { headers: { "Cache-Control": "public, max-age=0" } });
  const context = { URL, Response, Headers, upstream, runWithCloudflareRequestContext: (_r, _e, _c, fn) => fn() };
  vm.runInNewContext(protectBannerWorker(worker).replace("export default", "globalThis.worker ="), context);
  const response = await context.worker.fetch(new Request("https://mysquarefaceicon.com" + pathname), {}, {});
  assert.doesNotMatch(response.headers.get("cache-control"), /no-transform/);
}
const app = readFileSync("public/games/friend-block-test/app.mjs", "utf8");
assert.match(app, /maxlength: 16[, }]/); assert.doesNotMatch(app, /maxlength: 160/);
assert.match(app, /event\.source !== window\.parent/); assert.match(app, /event\.origin !== location\.origin/);
const frame = readFileSync("components/game-player/adapters/FriendQuizFrame.tsx", "utf8");
assert.match(frame, /src=\{FRIEND_QUIZ_ENTRY\}/); assert.doesNotMatch(frame, /src=.*fragment/);
console.log("PASS 16-character input, fragment-free iframe URLs, trusted handoff and public-page beacon eligibility");

const fixture = JSON.parse(readFileSync("scripts/fixtures/friend-quiz-fixes-delta.json", "utf8"));
const sha = text => createHash("sha256").update(text).digest("hex");
for (const [file, change] of Object.entries(fixture.files)) {
  const source = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  assert.equal(sha(source), change.afterSha256, file);
  assert.equal(sha(beforeFriendQuizFixesSource(file, source)), change.beforeSha256, file);
  assert.throws(() => beforeFriendQuizFixesSource(file, source + "\n// unrelated\n"));
  assert.notEqual(sha(source.replace(change.marker, "unrelated")), change.afterSha256);
}
console.log(`PASS ${Object.keys(fixture.files).length} exact repair deltas; historical goldens and original QUIZ-001 fixture preserved`);
