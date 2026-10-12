import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { decode, encode, STORAGE_KEY } from "../public/games/friend-block-test/core.mjs";
const require=createRequire(import.meta.url),{chromium}=require(process.env.QUIZ_PLAYWRIGHT||"playwright");
const base=process.env.QUIZ_BASE||"http://127.0.0.1:3112",out=`docs/quality/evidence/quiz-001/browser/${process.env.QUIZ_QA_RUN||'edge-cases'}`;
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:process.env.QUIZ_BROWSER_CHANNEL||"chrome",headless:true});
const records=[];
const report=()=>writeFileSync(`${out}/results.json`,JSON.stringify({base,browser:browser.version(),simulated:true,records},null,2));
async function open(context,hash=""){
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/games/friend-block-test'+hash,{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').innerText(),'Friend Block Test');
  assert.equal(await page.locator('meta[name="robots"]').count(),0);
  await page.screenshot({path:`${out}/preview-${page.viewportSize().width}.png`});
  await page.getByRole('button',{name:'Start Friend Block Test',exact:true}).focus();await page.keyboard.press('Enter');
  const f=page.frameLocator('iframe[title="Friend Block Test HTML5 game"]');await f.locator('h2').waitFor();return{page,f,errors};
}
async function make(f,name){await f.getByLabel('What should we call you?').fill(name);await f.getByRole('button',{name:'Make my quiz',exact:true}).click();for(let i=0;i<10;i++){await f.locator('.option').first().click();await f.getByRole('button',{name:i===9?'Get my share link':'Next question',exact:true}).click();}return f.locator('#share-link').inputValue();}
try{
  const c=await browser.newContext({viewport:{width:320,height:844}});
  const{page,f,errors}=await open(c);
  await f.getByLabel('What should we call you?').focus();await page.keyboard.type('Keyboard Test');await page.keyboard.press('Tab');
  assert.equal(await f.locator(':focus').innerText(),'Make my quiz');await page.keyboard.press('Enter');
  for(let i=0;i<10;i++){
    await page.keyboard.press('Tab');assert.match(await f.locator(':focus').innerText(),/^A/);
    const outline=await f.locator(':focus').evaluate(el=>getComputedStyle(el).outlineStyle);assert.notEqual(outline,'none');
    await page.keyboard.press('Space');for(let k=0;k<6;k++)await page.keyboard.press('Tab');
    assert.equal(await f.locator(':focus').innerText(),i===9?'Get my share link':'Next question');await page.keyboard.press('Enter');
  }
  const link=await f.locator('#share-link').inputValue(),quiz=decode(new URL(link).hash).payload;
  records.push({test:'full keyboard create flow and visible focus',passed:true});
  await f.getByRole('button',{name:'Edit my answers',exact:true}).click();
  for(let i=0;i<10;i++)await f.getByRole('button',{name:i===9?'Get my share link':'Next question',exact:true}).click();
  const edited=decode(new URL(await f.locator('#share-link').inputValue()).hash).payload;
  assert.notEqual(quiz.id,edited.id);assert.deepEqual(quiz.q,edited.q);assert.deepEqual(quiz.x,edited.x);
  const result={v:1,k:'r',quiz,n:'Old link friend',a:1,x:Array(10).fill(0)};
  await page.goto(base+'/games/friend-block-test#'+encode(result));
  await f.locator('.notice').filter({hasText:'Saved to your results'}).waitFor();
  records.push({test:'hash navigation and results from a link made before editing',passed:true});
  await page.evaluate(()=>localStorage.setItem('quiz-unrelated-fixture','keep'));
  await f.getByRole('button',{name:'My results',exact:true}).click();await f.getByRole('button',{name:'Clear quiz records',exact:true}).click();
  await f.getByRole('button',{name:'Yes, clear my quiz records',exact:true}).click();
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),STORAGE_KEY),null);assert.equal(await page.evaluate(()=>localStorage.getItem('quiz-unrelated-fixture')),'keep');
  await page.screenshot({path:`${out}/cleared-320.png`});records.push({test:'clear only quiz storage with explicit confirmation',passed:true});assert.equal(errors.length,0);await c.close();

  for(const hash of ['#fbt1.broken.00000000','#fbt2.a.00000000',new URL(link).hash.slice(0,-8)]){
    const ctx=await browser.newContext({viewport:{width:390,height:844}});const{page:p,f:frame,errors:err}=await open(ctx,hash);
    assert.equal(await frame.locator('h2').innerText(),"Let's fix that link");assert.match(await frame.locator('.intro').innerText(),/whole link/);
    await p.screenshot({path:`${out}/damaged-link-${records.length}.png`});await frame.getByRole('button',{name:'Make a new quiz'}).click();await frame.getByLabel('What should we call you?').waitFor();assert.equal(err.length,0);await ctx.close();
  }
  records.push({test:'three damaged/unknown/truncated links recover to a new quiz',passed:true});

  const blocked=await browser.newContext({viewport:{width:390,height:844}});
  await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked fixture','SecurityError');}});Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('Clipboard blocked fixture'))}});});
  const{page:bp,f:bf,errors:be}=await open(blocked);const blockedLink=await make(bf,'<b>😀</b> https://example.invalid');
  assert.equal(decode(new URL(blockedLink).hash).payload.n,'😀');assert.match(await bf.locator('.notice').innerText(),/could not remember/);
  await bf.getByRole('button',{name:'Copy link',exact:true}).click();assert.match(await bf.locator('#status').innerText(),/Link selected/);
  assert.equal(await bf.locator('#share-link').evaluate(el=>el.selectionEnd-el.selectionStart),blockedLink.length);
  await bf.getByRole('button',{name:'My results',exact:true}).click();assert.match(await bf.locator('.notice').innerText(),/unavailable/);
  await bp.screenshot({path:`${out}/storage-blocked-390.png`});assert.equal(be.length,0);await blocked.close();
  records.push({test:'blocked storage, cleaned markup/URL nickname and clipboard fallback remain usable',passed:true});

  const fullscreen=await browser.newContext({viewport:{width:1440,height:1000}});const{page:fp,f:ff}=await open(fullscreen);
  await fp.getByRole('button',{name:/Fullscreen/,exact:false}).click();await fp.waitForFunction(()=>!!document.fullscreenElement);
  await ff.getByLabel('What should we call you?').fill('Fullscreen');await ff.getByRole('button',{name:'Make my quiz',exact:true}).click();await ff.locator('.option').last().click();
  await fp.screenshot({path:`${out}/fullscreen-1440.png`});await fp.evaluate(()=>document.exitFullscreen());await fullscreen.close();
  records.push({test:'fullscreen enter, interaction and exit in desktop Chromium',passed:true});
  report();console.log(JSON.stringify(records,null,2));
}catch(error){records.push({failure:error.stack});report();throw error;}finally{await browser.close();}
