const { chromium } = require(process.env.MSFI_PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const output = process.env.MSFI_BROWSER_OUTPUT || require('node:path').resolve('artifacts/home-maker');
fs.mkdirSync(output, { recursive: true });
const report = { startedAt: new Date().toISOString(), base: process.env.MSFI_BROWSER_BASE || 'http://127.0.0.1:3000/', browser: 'Installed Chrome, headless Playwright; Browser plugin not available', viewports: [], flows: [], screenshots: [], downloads: [], errors: [], consoleLogs: [] };
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const title = 'Square Face Generator - Free Online Avatar & Icon Maker';
let browser;
async function screenshot(page, name) { await page.evaluate(()=>window.scrollTo(0,0)); const target=path.join(output, name+'.png'); await page.screenshot({path:target,fullPage:false}); report.screenshots.push(target); }
async function open(width, height, options={}) {
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<=430,acceptDownloads:true,serviceWorkers:'block',...options});
  const page=await context.newPage();
  const runtime=[]; const errors=[];
  page.on('request',r=>{if(/\/ruffle\/|\.wasm(?:\?|$)|\.swf(?:\?|$)/i.test(r.url())) runtime.push(r.url());});
  page.on('pageerror',e=>errors.push(String(e))); page.on('console',m=>{if(['error','warning'].includes(m.type()))report.consoleLogs.push({width,type:m.type(),text:m.text(),url:m.location().url});});
  const response=await page.goto(report.base,{waitUntil:'networkidle'}); assert.equal(response.status(),200);
  if(options.javaScriptEnabled!==false) await page.waitForFunction(()=>document.querySelector('[data-maker-mode]')?.dataset.makerMode!=='auto');
  return {context,page,runtime,errors};
}
async function canvasHash(page) { return page.locator('.simple-maker canvas').evaluate(el=>el.toDataURL('image/png')); }
async function download(page,size) {
  await page.getByRole('button',{name:`${size} pixel PNG`,exact:true}).click();
  const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download PNG',exact:true}).click()]);
  assert.equal(file.suggestedFilename(),`my-square-face-icon-${size}.png`);
  const target=path.join(output,`verified-avatar-${size}.png`); await file.saveAs(target);
  assert.equal(await file.failure(),null);
  const bytes=fs.readFileSync(target);assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(bytes.readUInt32BE(16),size);assert.equal(bytes.readUInt32BE(20),size);
  const decoded=await page.evaluate(async ({base64})=>{
    const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,c.width,c.height).data;const colors=new Set();for(let i=0;i<pixels.length;i+=4) colors.add([pixels[i],pixels[i+1],pixels[i+2],pixels[i+3]].join(','));return {width:image.width,height:image.height,colors:colors.size};
  },{base64:bytes.toString('base64')});
  assert.ok(decoded.colors>20,'decoded PNG must contain rendered artwork');
  report.downloads.push({size,path:target,bytes:bytes.length,sha256:sha(bytes),...decoded});
}
(async()=>{
  browser=await chromium.launch({executablePath:process.env.MSFI_CHROME_PATH || undefined,headless:true});
  for(const [width,height] of [[360,800],[390,844],[430,932],[768,1024],[1024,900],[1440,1000]]) {
    const {context,page,runtime,errors}=await open(width,height);
    assert.equal(await page.title(),title);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('h1').innerText(),'Square Face Generator');
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://mysquarefaceicon.com');
    assert.equal(await page.locator('[data-maker-mode]').getAttribute('data-maker-mode'),width<=760?'simple':'classic');
    const body=await page.locator('body').innerText();assert.ok(body.length>500);assert.ok(!/Unhandled Runtime Error|Application error:|Build Error/.test(body));
    const dimensions=await page.evaluate(()=>({width:innerWidth,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));assert.ok(dimensions.scroll<=dimensions.client,'no horizontal overflow');
    assert.equal(await page.locator('.simple-maker').isVisible(),width<=760);assert.equal(await page.locator('[data-core-game-preview]').isVisible(),width>760);assert.equal(runtime.length,0);
    if(width<=760) { const box=await page.locator('.simple-maker canvas').boundingBox();assert.ok(box.y+box.height<height,'Canvas preview fits first viewport'); const targets=await page.locator('.simple-maker button, .simple-maker select, .simple-maker input, .home-maker-switch button').evaluateAll(nodes=>nodes.filter(el=>el.getBoundingClientRect().width>0).map(el=>({label:el.textContent||el.getAttribute('aria-label'),height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width})));assert.ok(targets.every(t=>t.height>=44),'touch height >=44'); }
    await screenshot(page,'viewport-'+width);report.viewports.push({width,height,mode:width<=760?'simple':'classic',...dimensions,initialRuntimeRequests:runtime.length,pageErrors:errors});assert.deepEqual(errors,[]);await context.close();
  }
  const {context,page,runtime,errors}=await open(390,844);
  const initial=await canvasHash(page);
  await page.getByRole('combobox',{name:'Face',exact:true}).selectOption('wide');
  await page.getByRole('combobox',{name:'Hair',exact:true}).selectOption('spikes');
  await page.getByRole('combobox',{name:'Eyes',exact:true}).selectOption('wink');
  await page.getByRole('button',{name:'Use #8d5b43 for Skin',exact:true}).tap();
  await page.getByRole('button',{name:'Use #d9dcff for Background',exact:true}).click();
  const changed=await canvasHash(page);assert.notEqual(changed,initial);
  await page.getByRole('button',{name:'Classic game',exact:true}).click();assert.ok(await page.locator('[data-core-game-preview]').isVisible());assert.equal(runtime.length,0);
  await page.getByRole('button',{name:'Simple maker',exact:true}).click();assert.equal(await canvasHash(page),changed);assert.equal(await page.getByRole('combobox',{name:'Hair',exact:true}).inputValue(),'spikes');
  await page.setViewportSize({width:1440,height:1000});assert.equal(await page.locator('[data-maker-mode]').getAttribute('data-maker-mode'),'simple');assert.equal(await canvasHash(page),changed);
  await screenshot(page,'desktop-simple-edited');
  for(const size of [512,256,128]) await download(page,size);
  // Inject export failure in this isolated test page, then restore and retry.
  await page.evaluate(()=>{window.savedToDataURL=HTMLCanvasElement.prototype.toDataURL;HTMLCanvasElement.prototype.toDataURL=function(){throw new Error('injected export failure')};});
  await page.getByRole('button',{name:'Download PNG',exact:true}).click();assert.match(await page.locator('.simple-maker-status').innerText(),/PNG export failed.*settings are kept/);
  assert.equal(await page.getByRole('combobox',{name:'Hair',exact:true}).inputValue(),'spikes');
  await screenshot(page,'export-error');
  await page.evaluate(()=>{HTMLCanvasElement.prototype.toDataURL=window.savedToDataURL;delete window.savedToDataURL});assert.equal(await canvasHash(page),changed);
  await download(page,512);assert.match(await page.locator('.simple-maker-status').innerText(),/download requested/);
  await page.getByRole('button',{name:'Reset',exact:true}).click();assert.equal(await canvasHash(page),initial);assert.equal(await page.getByRole('combobox',{name:'Face',exact:true}).inputValue(),'soft');
  report.flows.push('Face/Hair/Eyes/Skin/Background update pixels; settings survive Classic/Simple switch and viewport resize; actual 512/256/128 PNG downloads decode with varied pixels; export error preserves settings and retry succeeds; Reset restores initial pixels.');
  assert.equal(runtime.length,0,'No Ruffle loaded throughout simple editor flow');
  await page.getByRole('button',{name:'Classic game',exact:true}).click();assert.equal(runtime.length,0);
  await page.getByRole('button',{name:'Start Square Face Generator game',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('[data-player-state]')?.getAttribute('data-player-state')==='ready',{},{timeout:30000});
  assert.ok(runtime.some(url=>url.endsWith('.swf')));report.flows.push({classicGame:'real local Ruffle reaches ready only after Play',runtimeRequests:runtime.length});
  assert.deepEqual(errors,[]);await context.close();
  const keyboard=await open(1440,1000);
  await keyboard.page.getByRole('button',{name:'Simple maker',exact:true}).focus();await keyboard.page.keyboard.press('Enter');assert.ok(await keyboard.page.locator('.simple-maker').isVisible());
  await keyboard.page.keyboard.press('Tab');assert.equal(await keyboard.page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'512 pixel PNG');
  await keyboard.page.keyboard.press('Tab');await keyboard.page.keyboard.press('Enter');assert.equal(await keyboard.page.getByRole('button',{name:'256 pixel PNG',exact:true}).getAttribute('aria-pressed'),'true');
  const outline=await keyboard.page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle);assert.notEqual(outline,'none');report.flows.push('Keyboard Enter changes mode; Tab reaches size controls; Enter selects 256; focus outline visible.');await keyboard.context.close();
  const nojs=await open(390,844,{javaScriptEnabled:false});assert.ok(await nojs.page.locator('.simple-maker').isVisible());assert.ok(!await nojs.page.locator('[data-core-game-preview]').isVisible());assert.ok(await nojs.page.locator('.simple-maker noscript p').isVisible());assert.equal(nojs.runtime.length,0);report.flows.push('Pre-hydration responsive CSS shows Simple maker on mobile; noscript guidance is visible; no runtime loads.');await nojs.context.close();
  report.result='passed';
})().catch(error=>{report.result='failed';report.errors.push(error.stack);console.error(error);process.exitCode=1;}).finally(async()=>{report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(output,'browser.json'),JSON.stringify(report,null,2));if(browser)await browser.close();console.log(JSON.stringify(report));});
