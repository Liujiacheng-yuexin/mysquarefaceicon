import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { decode } from "../public/games/friend-block-test/core.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.QUIZ_PLAYWRIGHT || "playwright");
const base = process.env.QUIZ_BASE || "http://127.0.0.1:3114";
const out = process.env.QUIZ_QA_OUT || join(tmpdir(), "msfi-quiz-fixes-qa");
const realTelemetry = process.env.QUIZ_REAL_TELEMETRY === "true";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.QUIZ_BROWSER_CHANNEL || "chrome", headless: true });
const rows = [], requests = [], consoleMessages = [], appErrors = [];
const requestRecords = new WeakMap();
const save = () => writeFileSync(join(out, "results.json"), JSON.stringify({ recordedAt: new Date().toISOString(), base, realTelemetry, browser: browser.version(), simulatedViewports: true, browserPlugin: "Browser plugin not available; existing Playwright and Chrome used", rows, consoleMessages, appErrors, requests }, null, 2));
const privateNeedles = new Set(["fbt1.", "QUIZHOSTPRIVACY", "QUIZPALPRIVACY"]);
function decoded(text) { for (let i = 0; i < 3; i++) { try { text = decodeURIComponent(text); } catch { break; } } return text; }
function checkRequest(request) {
  const data = { url: request.url(), method: request.method(), body: request.postData() || "", referrer: request.headers().referer || "" };
  let frameUrl = ""; try { frameUrl = request.frame().url(); } catch {}
  data.gameFrame = frameUrl.includes("/games/friend-block-test/index.html");
  requests.push(data);
  requestRecords.set(request, data);
}
function assertNetwork() {
  for (const request of requests) {
    const value = decoded(JSON.stringify(request));
    for (const needle of privateNeedles) assert(!value.includes(needle), `Private quiz content in request to ${new URL(request.url).hostname}`);
    if (request.gameFrame) {
      assert.equal(new URL(request.url).origin, new URL(base).origin, "The game never requests third parties");
      assert.equal(request.method, "GET", "The game never uploads data");
    }
  }
  assert.equal(appErrors.length, 0, JSON.stringify(appErrors));
}
async function context(width) {
  const result = await browser.newContext({ viewport: { width, height: 844 }, permissions: ["clipboard-read", "clipboard-write"] });
  if (!realTelemetry) await result.route("**/*", async route => {
    const request = route.request();
    if (new URL(request.url()).origin === new URL(base).origin) {
      // Force the iframe's load event to arrive after its interactive module.
      if (new URL(request.url()).pathname === "/game-face-samples/classic.webp") await new Promise(resolve => setTimeout(resolve, 1800));
      return route.continue();
    }
    if (request.resourceType() === "script") return route.fulfill({ contentType: "text/javascript", body: `fetch('https://telemetry.example.invalid/probe',{method:'POST',body:JSON.stringify({url:location.href,referrer:document.referrer})}).catch(function(){});` });
    return route.fulfill({ status: 204, body: "" });
  });
  result.on("page", page => {
    page.on("request", checkRequest);
    page.on("response", response => { const record = requestRecords.get(response.request()); if (record) record.status = response.status(); });
    page.on("requestfailed", request => { const record = requestRecords.get(request); if (record) record.failure = request.failure()?.errorText; });
    page.on("pageerror", error => appErrors.push(error.stack || error.message));
    page.on("console", message => { if (["error", "warning"].includes(message.type())) consoleMessages.push({ type: message.type(), text: message.text(), location: message.location() }); });
  });
  return result;
}
async function visit(page, url, shared = false) {
  await page.goto("about:blank");
  await page.goto(url, { waitUntil: "load" });
  await page.getByRole("heading", { name: "Friend Block Test", exact: true }).waitFor();
  assert.equal(await page.title(), "Friend Block Test: How Well Do Your Friends Know You?");
  assert.equal(await page.locator("nextjs-portal, #webpack-dev-server-client-overlay, vite-error-overlay").count(), 0);
  if (shared) {
    assert.equal(new URL(page.url()).hash, "", "Outer URL is clean before analytics");
  } else {
    // This control is enabled by the player's mount effect, so a cold page is
    // hydrated before the first click (DOMContentLoaded alone is insufficient).
    await page.getByRole("button", { name: "Fullscreen", exact: true }).waitFor();
    await page.getByRole("button", { name: "Start Friend Block Test", exact: true }).click();
  }
  const frame = page.frameLocator('iframe[title="Friend Block Test HTML5 game"]');
  await frame.locator("h2").waitFor();
  assert(!String(await page.locator('iframe[title="Friend Block Test HTML5 game"]').getAttribute("src")).includes("#"));
  if (shared) {
    const top = await page.locator("#game-player").evaluate(el => el.getBoundingClientRect().top);
    assert(top >= 0 && top < 180, `Shared player automatically scrolled into view: ${top}`);
  }
  return frame;
}
async function noOverflow(page, frame) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(await frame.locator("body").evaluate(el => el.scrollWidth <= el.ownerDocument.defaultView.innerWidth), true);
}
try {
  for (const width of [320, 375, 390]) {
    const c = await context(width), page = await c.newPage();
    await page.goto(base + "/games/friend-block-test", { waitUntil: "load" });
    const preview = page.getByRole("button", { name: "Start Friend Block Test", exact: true }); await preview.waitFor();
    await page.getByRole("button", { name: "Fullscreen", exact: true }).waitFor();
    const dimensions = await page.locator(".flash-stage").evaluate(el => ({ width: el.getBoundingClientRect().width, left: el.getBoundingClientRect().left, viewport: innerWidth }));
    assert(dimensions.width <= width, `Before activation: stage ${dimensions.width}px exceeds ${width}px viewport`);
    assert(dimensions.left >= 0 && dimensions.left + dimensions.width <= width + 0.5);
    assert.equal(await page.locator('[data-player-activated="false"]').count(), 1);
    for (const control of await page.locator(".flash-cover, .flash-play-panel, .game-control-bar button, .game-control-bar a").all()) {
      const bounds = await control.boundingBox();
      assert(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width + 0.5, `Clipped pre-activation control at ${width}: ${await control.innerText()}`);
    }
    await page.locator(".flash-stage").scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(out, `preview-${width}.png`) });
    rows.push({ width, state: "before activation", stageWidth: dimensions.width, allControlsFit: true }); save();
    await c.close();
    console.log(`PASS ${width} before activation: stage ${dimensions.width}px, cover/Start/Restart/Report Issue fit`);
  }
  for (const width of [320, 375]) {
    const maker = await context(width), friend = await context(width), a = await maker.newPage(), b = await friend.newPage();
    if (width === 375) {
      await a.goto(base + "/games/friend-block-test", { waitUntil: "load" });
      await a.evaluate(async () => {
        await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true }));
        const cache = await caches.open("msfi-v9-ruffle-2026-05-12");
        await cache.put("/games/friend-block-test/app.mjs", new Response("document.getElementById('app').textContent='STALE QUIZ MODULE';", { headers: { "Content-Type": "text/javascript" } }));
      });
    }
    const fa = await visit(a, base + "/games/friend-block-test");
    assert.equal(await fa.locator("#nickname").getAttribute("maxlength"), "16");
    await fa.locator("#nickname").fill("12345678901234567");
    assert.equal((await fa.locator("#nickname").inputValue()).length, 16, "Input enforces maxlength before submission");
    await fa.locator("#nickname").fill("QUIZHOSTPRIVACY");
    await fa.getByRole("button", { name: "Make my quiz", exact: true }).click();
    const prompts = [];
    for (let i = 0; i < 10; i++) {
      prompts.push(await fa.locator("h2").innerText());
      await fa.locator(".option").nth(i % 4).click(); await noOverflow(a, fa);
      if (i === 0) await a.screenshot({ path: join(out, `create-${width}.png`) });
      await fa.getByRole("button", { name: i === 9 ? "Get my share link" : "Next question", exact: true }).click();
      if (i === 0) {
        await a.waitForTimeout(2200);
        assert.match(await fa.locator(".progress-row").innerText(), /2\s*\/\s*10/, "A late iframe load must not reset an in-progress quiz");
      }
    }
    const quizLink = await fa.locator("#share-link").inputValue();
    privateNeedles.add(decode(new URL(quizLink).hash).payload.id);
    const fb = await visit(b, quizLink, true);
    assert.equal(await fb.locator("h2").innerText(), "QUIZHOSTPRIVACY's friend quiz");
    await b.screenshot({ path: join(out, `invitation-${width}.png`) });
    assert.equal(await fb.locator("#nickname").getAttribute("maxlength"), "16");
    await fb.locator("#nickname").fill("QUIZPALPRIVACY");
    await fb.getByRole("button", { name: "Start guessing", exact: true }).click();
    for (let i = 0; i < 10; i++) {
      assert.equal(await fb.locator("h2").innerText(), prompts[i]);
      await fb.locator(".option").nth(i < 7 ? i % 4 : (i + 1) % 4).click(); await noOverflow(b, fb);
      if (i === 0) await b.screenshot({ path: join(out, `answer-${width}.png`) });
      await fb.getByRole("button", { name: i === 9 ? "See my result" : "Next question", exact: true }).click();
    }
    assert.match(await fb.locator(".score-box").innerText(), /70.*100/s);
    const resultLink = await fb.locator("#share-link").inputValue();
    await b.screenshot({ path: join(out, `result-${width}.png`) });
    const received = await visit(a, resultLink, true);
    assert.match(await received.locator(".notice").innerText(), /Saved to your results/);
    await received.getByRole("button", { name: "My results", exact: true }).click();
    assert.equal(await received.locator(".history li").count(), 1);
    await noOverflow(a, received); await a.screenshot({ path: join(out, `received-${width}.png`) });
    await a.evaluate(hash => { location.hash = hash; }, new URL(resultLink).hash);
    await received.locator(".notice").filter({ hasText: "already in your list" }).waitFor();
    assert.equal(new URL(a.url()).hash, "");
    await a.waitForTimeout(13000);
    assertNetwork();
    rows.push({ width, state: "create/answer/result", autoStartsSharedQuiz: true, autoStartsSharedResult: true, scrolledIntoView: true, maxlength: 16, score: 70, savedOnce: true, hashChangeAfterTelemetry: true, lateFrameLoadDoesNotReset: true, oldServiceWorkerCacheBypassed: width === 375, privatePayloadRequests: 0 }); save();
    await maker.close(); await friend.close();
    console.log(`PASS ${width}: create → fresh automatic invitation → answer → 70/100 → automatic return → saved once; no private payload in requests`);
  }
  assert(requests.some(row => row.url.includes("googletagmanager.com/gtag/js")), "GA enabled");
  assert(requests.some(row => row.url.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")), "AdSense enabled");
  if (realTelemetry) assert(requests.some(row => row.url.includes("cloudflareinsights.com/beacon.min.js")), "Cloudflare beacon enabled");
  assertNetwork(); save();
  console.log(`PASS telemetry: GA/AdSense${realTelemetry ? "/Cloudflare" : " (mock vendors)"}; ${requests.length} inspected requests, zero quiz fragments, nicknames or quiz IDs transmitted`);
} catch (error) {
  let index = 0;
  for (const context of browser.contexts()) for (const page of context.pages()) {
    await page.screenshot({ path: join(out, `failure-${index}.png`) }).catch(() => {});
    writeFileSync(join(out, `failure-${index++}.json`), JSON.stringify({ url: page.url(), body: await page.locator("body").innerText().catch(() => "unavailable"), frames: await Promise.all(page.frames().map(async frame => ({ url: frame.url(), body: await frame.locator("body").innerText().catch(() => "unavailable") }))) }, null, 2));
  }
  rows.push({ failure: error.stack }); save(); throw error;
}
finally { await browser.close(); }
