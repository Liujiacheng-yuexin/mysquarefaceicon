import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.QUIZ_PLAYWRIGHT || "playwright");
const base = process.env.QUIZ_BASE || "http://127.0.0.1:3112";
const out = `docs/quality/evidence/quiz-001/browser/${process.env.QUIZ_QA_RUN || "matrix"}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.QUIZ_BROWSER_CHANNEL || "chrome", headless: true });
const records = [];
const report = () => writeFileSync(`${out}/results.json`, JSON.stringify({ date: "2026-10-12", base, browser: browser.version(), browserPlugin: "Browser plugin not available; bundled Playwright used", simulatedViewports: true, records }, null, 2));
async function start(page, url) {
  await page.goto("about:blank");
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.title(), "Friend Block Test: How Well Do Your Friends Know You?");
  assert.equal(await page.locator("nextjs-portal, #webpack-dev-server-client-overlay, vite-error-overlay").count(), 0);
  await page.getByRole("heading", { name: "Friend Block Test", exact: true }).waitFor();
  const incomingHash = new URL(url).hash;
  if (page.viewportSize().width <= 390) {
    await page.getByRole("button", { name: "Play this friend quiz", exact: true }).click();
    assert.equal(new URL(page.url()).hash, incomingHash, "Mobile Play preserves the shared quiz/result fragment");
  } else {
    await page.getByRole("button", { name: "Start Friend Block Test", exact: true }).click();
  }
  const frame = page.frameLocator('iframe[title="Friend Block Test HTML5 game"]');
  await frame.locator("h2").waitFor();
  return frame;
}
async function checkOverflow(page, frame) {
  assert.equal(await page.evaluate(() => innerWidth), page.viewportSize().width, "actual CSS viewport width");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "outer page overflow");
  assert.equal(await frame.locator("body").evaluate(el => el.scrollWidth > el.ownerDocument.defaultView.innerWidth), false, "game overflow");
}
try {
  for (const width of [320, 390, 768, 1440]) {
    const height = width >= 768 ? 1000 : 844;
    const maker = await browser.newContext({ viewport: { width, height }, permissions: ["clipboard-read", "clipboard-write"] });
    const friend = await browser.newContext({ viewport: { width, height }, permissions: ["clipboard-read", "clipboard-write"] });
    const a = await maker.newPage(), b = await friend.newPage();
    const errors = [], requests = [];
    for (const p of [a,b]) {
      p.on("pageerror", e => errors.push(e.message));
      p.on("console", m => { if (["error","warning"].includes(m.type())) errors.push(m.text()); });
      p.on("request", r => requests.push({ method:r.method(), url:r.url() }));
    }
    const frameA = await start(a, `${base}/games/friend-block-test`);
    await a.screenshot({ path: `${out}/start-${width}.png` });
    await frameA.getByLabel("What should we call you?").fill("Alex 123456789012");
    await frameA.getByRole("button", { name: "gamer avatar", exact:true }).click();
    await frameA.getByRole("button", { name: "Make my quiz", exact:true }).click();
    const prompts = [];
    for (let i=0;i<10;i++) {
      if(i===2){const old=await frameA.locator("h2").innerText();await frameA.getByRole("button",{name:"Swap this question"}).click();assert.notEqual(await frameA.locator("h2").innerText(),old);}
      prompts.push(await frameA.locator("h2").innerText());
      await frameA.locator(".option").nth(i%4).click();
      await checkOverflow(a,frameA);
      if(i===0)await a.screenshot({path:`${out}/create-${width}.png`});
      await frameA.getByRole("button",{name:i===9?"Get my share link":"Next question",exact:true}).click();
    }
    const quizLink=await frameA.locator("#share-link").inputValue();assert.ok(quizLink.length<=1800);
    await frameA.getByRole("button",{name:"Copy link",exact:true}).click();
    await frameA.locator("#status").filter({ hasText: "Link copied." }).waitFor();
    assert.ok(await a.evaluate(()=>navigator.clipboard.readText()) === quizLink, "Clipboard matches after the UI confirms completion");
    await a.screenshot({path:`${out}/share-${width}.png`});
    const frameB=await start(b,quizLink);
    assert.equal(await frameB.locator("h2").innerText(),"Alex 12345678901's friend quiz");
    await frameB.getByLabel("What should we call you?").fill(`Friend ${width}`);
    await frameB.getByRole("button",{name:"cute avatar",exact:true}).click();
    await frameB.getByRole("button",{name:"Start guessing",exact:true}).click();
    for(let i=0;i<10;i++){
      assert.equal(await frameB.locator("h2").innerText(),prompts[i],"Fresh browser receives the same question sequence");
      await frameB.locator(".option").nth(i<7?i%4:(i+1)%4).click();await checkOverflow(b,frameB);
      if(i===0)await b.screenshot({path:`${out}/answer-${width}.png`});
      await frameB.getByRole("button",{name:i===9?"See my result":"Next question",exact:true}).click();
    }
    assert.equal(await frameB.locator(".tier").innerText(),"Close Crew");
    assert.match(await frameB.locator(".score-box").innerText(),/70.*100/s);
    await checkOverflow(b,frameB);await b.screenshot({path:`${out}/result-${width}.png`});
    const resultLink=await frameB.locator("#share-link").inputValue();assert.ok(resultLink.length<=1800);
    const returnFrame=await start(a,resultLink);
    assert.match(await returnFrame.locator(".notice").innerText(),/Saved to your results/);
    await returnFrame.getByRole("button",{name:"My results",exact:true}).click();
    assert.equal(await returnFrame.locator(".history li").count(),1);assert.match(await returnFrame.locator(".history").innerText(),/7 \/ 10/);
    await checkOverflow(a,returnFrame);await a.screenshot({path:`${out}/received-${width}.png`});
    const again=await start(a,resultLink);assert.match(await again.locator(".notice").innerText(),/already in your list/);
    if(width===320){await a.waitForTimeout(13000);assert.equal(await a.locator('script[src*="goog"],script[src*="cloudflareinsights"]').count(),0);}
    assert.equal(errors.length,0,JSON.stringify(errors));
    assert.ok(requests.every(r=>r.url.startsWith(base+"/")),"No third-party requests on quiz documents");
    assert.ok(requests.every(r=>r.method==="GET"),"No upload requests");
    assert.ok(requests.every(r=>!r.url.includes("fbt1.")&&!r.url.includes("Alex%20")),"No payload in network URLs");
    records.push({width,height,create:true,answer:true,result:true,freshContextRoundTrip:true,score:70,duplicatePrevented:true,copyMatches:true,noOverflow:true,consoleErrors:errors,requests:requests.length,externalRequests:0,quizLinkLength:quizLink.length,resultLinkLength:resultLink.length});report();
    await maker.close();await friend.close();console.log(`PASS ${width}: create -> fresh browser -> 70/100 -> saved once; no overflow or external requests.`);
  }
} catch(error){records.push({failure:error.stack});report();throw error;}
finally{await browser.close();}
