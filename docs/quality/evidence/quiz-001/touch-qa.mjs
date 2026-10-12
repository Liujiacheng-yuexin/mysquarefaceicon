import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.QUIZ_PLAYWRIGHT||'playwright');
const base='http://127.0.0.1:3113',out='docs/quality/evidence/quiz-001/browser/touch';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const contexts=[],errors=[],requests=[];
async function setup(){const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});contexts.push(context);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push({url:r.url(),method:r.method()}));return page;}
async function open(page,url){await page.goto('about:blank');await page.goto(url,{waitUntil:'networkidle'});const hash=new URL(url).hash;await page.getByRole('button',{name:'Play this friend quiz',exact:true}).tap();assert.equal(new URL(page.url()).hash,hash);const f=page.frameLocator('iframe[title="Friend Block Test HTML5 game"]');await f.locator('h2').waitFor();assert.equal(await page.evaluate(()=>innerWidth),390);return f;}
try{
 const a=await setup(),b=await setup();const fa=await open(a,base+'/games/friend-block-test');
 await fa.getByLabel('What should we call you?').fill('Tap Host');await fa.getByRole('button',{name:'gamer avatar',exact:true}).tap();await fa.getByRole('button',{name:'Make my quiz',exact:true}).tap();
 for(let i=0;i<10;i++){const option=fa.locator('.option').nth(0);const box=await option.boundingBox();assert.ok(box.height>=44);await option.tap();await fa.getByRole('button',{name:i===9?'Get my share link':'Next question',exact:true}).tap();}
 const link=await fa.locator('#share-link').inputValue();const fb=await open(b,link);assert.equal(await fb.locator('h2').innerText(),"Tap Host's friend quiz");
 await fb.getByLabel('What should we call you?').fill('Tap Friend');await fb.getByRole('button',{name:'Start guessing',exact:true}).tap();
 for(let i=0;i<10;i++){await fb.locator('.option').nth(i<5?0:1).tap();await fb.getByRole('button',{name:i===9?'See my result':'Next question',exact:true}).tap();}
 assert.match(await fb.locator('.score-box').innerText(),/50.*100/s);await b.screenshot({path:out+'/touch-result-390.png'});
 const returned=await open(a,await fb.locator('#share-link').inputValue());assert.match(await returned.locator('.notice').innerText(),/Saved to your results/);await returned.getByRole('button',{name:'My results',exact:true}).tap();assert.match(await returned.locator('.history').innerText(),/5 \/ 10/);
 await a.screenshot({path:out+'/touch-received-390.png'});assert.equal(errors.length,0);assert.ok(requests.every(r=>r.url.startsWith(base+'/')&&r.method==='GET'));
 const result={date:'2026-10-12',base,environment:'Desktop Chrome with isMobile and hasTouch; not a physical phone',viewport:{width:390,height:844,deviceScaleFactor:2},create:true,answer:true,returnedResult:true,mobilePlayPreservesHash:true,answerTargetsAtLeast44px:true,score:50,externalRequests:0,pageErrors:errors};writeFileSync(out+'/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{for(const c of contexts)await c.close();await browser.close();}
