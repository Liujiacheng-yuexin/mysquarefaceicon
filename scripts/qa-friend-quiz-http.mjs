import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
const bases=(process.env.QUIZ_BASES||'http://127.0.0.1:3112,http://127.0.0.1:3113').split(',');
const site='https://mysquarefaceicon.com';
const rows=[];
async function request(base,path){const response=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(20000)});const text=await response.text();return{response,text};}
for(const base of bases){
  const {response:sitemapResponse,text:sitemap}=await request(base,'/sitemap.xml');assert.equal(sitemapResponse.status,200);
  const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,22);assert.equal(new Set(urls).size,urls.length);
  assert.equal(urls.filter(url=>url===site+'/games/friend-block-test').length,1);assert.ok(!urls.some(url=>url.includes('/category/')||url.endsWith('.html')));
  for(const url of urls){const path=new URL(url).pathname;const{response,text}=await request(base,path);assert.equal(response.status,200,path);
    assert.ok(text.includes(`rel="canonical" href="${url}"`),path+' canonical');
    assert.doesNotMatch(response.headers.get('x-robots-tag')||'',/noindex/i,path);
    assert.doesNotMatch(text,/<meta[^>]+(?:name="robots"|name="googlebot")[^>]+content="[^"]*noindex/i,path);
    assert.equal((text.match(/<h1(?:\s|>)/g)||[]).length,1,path+' one H1');
    if(path==='/games/friend-block-test'){
      assert.match(text,/<title>Friend Block Test: How Well Do Your Friends Know You\?<\/title>/);
      assert.doesNotMatch(response.headers.get('cache-control')||'',/no-transform/, 'The public detail page allows the Cloudflare beacon');
      const types=[...text.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])['@type']);
      assert.deepEqual(types.sort(),['BreadcrumbList','FAQPage','VideoGame'].sort());
      assert.doesNotMatch(text,/aggregateRating/);
    }
  }
  const nonIndex=['/games','/category/face-makers','/category/avatar-makers','/category/pixel-avatars','/category/retro-flash','/category/character-creators','/category/friend-quizzes','/es','/vi','/ja','/th','/ar','/ru','/id','/cute-square-avatar-generator','/pixel-square-face-maker'];
  for(const path of nonIndex){const{response,text}=await request(base,path);assert.equal(response.status,200,path);assert.match(text,/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i,path);}
  for(const path of ['/games/not-a-real-quiz','/games/square-face-generator','/category/not-a-category']){const{response,text}=await request(base,path);assert.equal(response.status,404,path);assert.match(text,/noindex/);}
  for(const path of ['/games/%66riend-block-test','/games/friend%2Dblock%2Dtest?ref=local']){const{response,text}=await request(base,path);assert.equal(response.status,200,path);assert.match(text,/<h1>Friend Block Test<\/h1>/);if(base===(process.env.QUIZ_WORKER_BASE||'http://127.0.0.1:3113'))assert.doesNotMatch(response.headers.get('cache-control')||'',/no-transform/);}
  const{response:raw,text:html}=await request(base,'/games/friend-block-test/index.html');assert.equal(raw.status,200);assert.equal(raw.headers.get('location'),null);assert.match(html,/name="robots" content="noindex, follow"/);assert.match(html,/connect-src 'none'/);assert.match(raw.headers.get('cache-control'),/no-transform/);
  rows.push({base,indexedPages:22,preservedNoindexPages:nonIndex.length,real404s:3,encodedRoutes:2,detail:{status:200,canonical:site+'/games/friend-block-test',indexable:true,schemas:['VideoGame','FAQPage','BreadcrumbList']},staticEntry:{status:200,noindex:true,noRedirect:true,noTransform:true},sitemapUnique:true});
  console.log(`PASS ${base}: 22 index pages, 16 noindex pages, 3 real 404s, encoded quiz routes and separate static entry.`);
}
writeFileSync(process.env.QUIZ_HTTP_OUT||'docs/quality/evidence/quiz-001/final/http-results.json',JSON.stringify({recordedAt:new Date().toISOString(),nextBuildId:readFileSync('.next/BUILD_ID','utf8').trim(),results:rows},null,2));
