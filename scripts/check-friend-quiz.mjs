import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { QUESTIONS, AVATARS, cleanName, encode, decode, checksum, shareLink, score, tier, replaceQuestion, readHistory, saveOwned, saveResult, STORAGE_KEY } from "../public/games/friend-block-test/core.mjs";

let cases = 0;
function test(name, run) { run(); cases++; console.log(`PASS ${name}`); }
const quiz = { v: 1, k: "q", id: "123456abcdef", n: "Alex", a: 0, q: Array.from({ length: 10 }, (_, i) => i), x: [0,1,2,3,0,1,2,3,0,1] };
const result = { v: 1, k: "r", quiz, n: "Sam", a: 1, x: [...quiz.x] };
const storage = () => { const map = new Map(); return { map, getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) }; };

test("Q1 quiz and result round trips preserve every field", () => {
  for (const payload of [quiz, result, { ...quiz, n: "小小😀伙伴" }]) assert.deepEqual(decode(encode(payload)), { ok: true, payload });
});
test("Q2 truncated, tampered, malformed, oversized and unknown versions recover", () => {
  const token = encode(quiz);
  for (const fragment of [token.slice(0,-1), token.replace(/\.$/,"" )+'a', token.replace('fbt1','fbt2'), token.replace(/.$/,'z'), '#', 'not-a-quiz', 'x'.repeat(1801), null, '#fbt1.AAAA.00000000']) {
    const outcome = decode(fragment); assert.equal(outcome.ok,false); assert.match(outcome.message,/copy the whole link/);
  }
  const badJson = btoa(JSON.stringify({ ...quiz, q: Array(10).fill(1) })).replace(/=+$/,'');
  assert.equal(decode(`fbt1.${badJson}.${checksum(badJson)}`).ok,false);
  for (const bad of [{ ...quiz, x: [] }, { ...quiz, n: '<script>' }, { ...quiz, a: AVATARS.length }, { ...quiz, surprise: true }, { ...result, quiz: { ...quiz, v: 2 } }]) assert.throws(()=>encode(bad));
});
test("Q3 longest Unicode nicknames and both full links stay below 1800", () => {
  const q = { ...quiz, n: '😀'.repeat(16) }; const r = { ...result, quiz: q, n: '🧑'.repeat(16) };
  for (const payload of [q,r]) { const link=shareLink(payload,'https://mysquarefaceicon.com'); assert.ok(link.length<=1800); assert.equal(new URL(link).search,''); assert.equal(new URL(link).pathname,'/games/friend-block-test'); console.log(`  ${payload.k}: ${link.length} characters`); }
});
test("Q4 nickname Unicode limits, controls, markup and links", () => {
  assert.equal(cleanName('a'.repeat(100)), 'a'.repeat(16)); assert.equal(Array.from(cleanName('😀'.repeat(30))).length,16);
  assert.equal(cleanName(' A\u0000\u0007\u202eB '),'AB');
  assert.equal(cleanName('<b>Alex</b> https://bad.example/path'),'Alex');
  assert.equal(cleanName('www.bad.example bad.example/path'), '');
  assert.equal(cleanName('<img src=x onerror=alert(1)>Sam'),'Sam');
});
test("Q5 all scores and four tier boundaries", () => {
  const expected = ['Getting in Sync','Getting in Sync','Getting in Sync','Getting in Sync','Good Vibes','Good Vibes','Good Vibes','Close Crew','Close Crew','Same Wavelength','Same Wavelength'];
  for(let correct=0;correct<=10;correct++){ const guesses=quiz.x.map((x,i)=>i<correct?x:(x+1)%4);assert.equal(score(quiz,guesses),correct);assert.equal(tier(correct),expected[correct]); }
  for(const invalid of [-1,11,1.5,NaN])assert.throws(()=>tier(invalid));
});
test("Q6 24 unique original questions; exactly four distinct choices; swaps preserve uniqueness", () => {
  assert.ok(QUESTIONS.length>=20);assert.equal(new Set(QUESTIONS.map(q=>q.prompt)).size,QUESTIONS.length);
  QUESTIONS.forEach((q,id)=>{ assert.equal(q.id,id);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4); });
  const swapped=replaceQuestion(quiz,0);assert.notEqual(swapped.q[0],quiz.q[0]);assert.equal(new Set(swapped.q).size,10);assert.equal(swapped.x[0],null);assert.deepEqual(swapped.q.slice(1),quiz.q.slice(1));
});
test("Q7 static game has no external resource domains or upload/network APIs", () => {
  for(const file of readdirSync('public/games/friend-block-test').filter(x=>/\.(?:html|css|mjs)$/.test(x))){
    const text=readFileSync(`public/games/friend-block-test/${file}`,'utf8');
    assert.doesNotMatch(text,/(?:https?:)?\/\/[a-z\d][a-z\d.-]+\.[a-z]{2,}/i,file);
    assert.doesNotMatch(text,/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource/,file);
    assert.doesNotMatch(text,/\.innerHTML\s*=|insertAdjacentHTML|document\.write|\beval\(/,file);
  }
  assert.match(readFileSync('public/games/friend-block-test/index.html','utf8'),/connect-src 'none'/);
});
test("Local results require creator association, recompute scores and deduplicate", () => {
  const s=storage();s.setItem('unrelated','keep');assert.equal(saveResult(s,result).status,'other-device');assert.equal(saveOwned(s,quiz),true);
  assert.equal(saveResult(s,result).status,'saved');assert.equal(saveResult(s,result).status,'duplicate');assert.equal(readHistory(s).data.results.length,1);
  assert.equal(readHistory(s).data.results[0].correct,10);assert.ok(!('x' in readHistory(s).data.results[0]));assert.ok(!('x' in readHistory(s).data.owned[0]));
  assert.equal(saveResult(s,{...result,quiz:{...quiz,x:Array(10).fill(0)}}).status,'other-device');s.removeItem(STORAGE_KEY);assert.equal(s.getItem('unrelated'),'keep');
});
test("Blocked, full, corrupted and oversized storage remains recoverable", () => {
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('full');}};
  assert.equal(readHistory(blocked).available,false);assert.equal(saveOwned(blocked,quiz),false);assert.equal(saveResult(blocked,result).status,'unavailable');
  for(const raw of ['{bad','null','x'.repeat(50001),JSON.stringify({v:1,owned:[],results:[{n:'<img>'}]})]){const s=storage();s.setItem(STORAGE_KEY,raw);assert.equal(readHistory(s).available,false);assert.equal(saveOwned(s,quiz),false);assert.equal(s.getItem(STORAGE_KEY),raw,"Do not silently replace unreadable user data");}
  const s=storage();saveOwned(s,quiz);for(let i=0;i<55;i++)saveResult(s,{...result,n:`Friend ${i}`});assert.equal(readHistory(s).data.results.length,50);
});
console.log(`QUIZ-001: ${cases} check groups passed.`);
