import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { modules, scriptHarness, React, render, plain } from "./category-sample-test-utils.mjs";
import { beforeFriendQuizSource } from "./friend-quiz-compat.mjs";
import { beforeFriendQuizFixesSource } from "./friend-quiz-fixes-compat.mjs";
import { protectBannerWorker } from "./banner-worker-policy.mjs";

const loader=modules();
const quiz=loader.load('data/games/friend-block-test.ts').default;
const metadata=loader.load('lib/seo/game-metadata.ts');
const policy=loader.load('lib/games/friend-quiz-policy.ts');
const route=loader.load('lib/games/routes.ts');
const categories=loader.load('lib/games/categories.ts');
const categoryPage=loader.load('app/category/[slug]/page.tsx');
const directory=loader.load('lib/games/directory.ts').resolveGamesDirectory();
assert.equal(policy.isIndexAllowedNewGame(quiz),true);
assert.equal(plain(metadata.buildGameMetadata(quiz)).robots,undefined);
assert.equal(route.resolveNewGameSlug('friend-block-test').id,'friend-block-test');
assert.equal(directory.games.length,4);assert.equal(directory.onSiteGames.length,3);
assert.deepEqual(plain(directory.categoryRoutes.map(r=>r.category.slug)),['face-makers','avatar-makers','pixel-avatars','retro-flash','character-creators','friend-quizzes']);
const friendCategory=categories.resolveDirectoryCategoryRoute('friend-quizzes');
assert.deepEqual(plain(friendCategory.games.map(g=>g.id)),['friend-block-test']);
const catMeta=categoryPage.generateMetadata({params:{slug:'friend-quizzes'}});
assert.equal(catMeta.robots.index,false);
assert.equal(catMeta.alternates.canonical,'https://mysquarefaceicon.com/category/friend-quizzes');
const catHTML=render(React.createElement(categoryPage.default,{params:{slug:'friend-quizzes'}}));
assert.match(catHTML,/data-ad-eligible="false"/);assert.match(catHTML,/<h1>Friend Quizzes<\/h1>/);
assert.match(catHTML,/data-game-id="friend-block-test"/);assert.match(catHTML,/data-navigation="document"/);
console.log('PASS actual fourth record, directory grouping, sixth category and noindex/ad boundaries');
const startButton=render(React.createElement(loader.load('components/game/FriendQuizStartButton.tsx').default));
assert.match(startButton,/<button[^>]+aria-label="Play this friend quiz"/);
assert.doesNotMatch(startButton,/href=/,'Mobile play must not replace a payload hash with an anchor');

const layout=readFileSync('app/layout.tsx','utf8');
const inline=layout.match(/__html: (`[\s\S]*?`)/)[1];
const script=vm.runInNewContext(inline,{googleAnalyticsId:'fixture'});
for(const pathname of ['/games/friend-block-test/index.html','/discord-banner-size']){
  const created=[];const context={location:{pathname},document:{createElement:()=>({}),head:{appendChild:s=>created.push(s)}}};context.window=context;
  vm.runInNewContext(script,context);assert.equal(created.length,0);assert.equal(context.dataLayer,undefined);
  const h=scriptHarness(pathname);h.wait();h.event('pointerdown');assert.equal(h.scripts.length,0);h.unmount();
}
for(const [from,to] of [['/','/games/friend-block-test'],['/games/friend-block-test','/'],['/games','/games/friend-block-test']]){
  const h=scriptHarness(from);h.move(to);h.event('pointerdown');assert.ok(h.replacements.length>=1);assert.equal(h.ads().length,0);h.unmount();
}
assert.equal(policy.isFriendQuizPath('/games/friend-block-test-other'),false);
console.log('PASS raw game and banner GA/ad exclusion, and full-document transition guard');

const worker=`export default {
    async fetch(request, env, ctx) {
        return runWithCloudflareRequestContext(request, env, ctx, async () => {
            return upstream;
        });
    },
};
`;
for(const path of ['/discord-banner-size','/games/friend-block-test/index.html','/games/friend-block-test/app.mjs']){
  const upstream=new Response('private quiz bytes',{status:200,headers:{'Cache-Control':'public, max-age=0'}});
  const ctx={URL,Response,Headers,upstream,runWithCloudflareRequestContext:(_r,_e,_c,fn)=>fn()};
  vm.runInNewContext(protectBannerWorker(worker).replace('export default','globalThis.worker ='),ctx);
  const response=await ctx.worker.fetch(new Request('https://mysquarefaceicon.com'+path),{},{});
  assert.equal(response.body,upstream.body);assert.equal(response.status,200);assert.match(response.headers.get('cache-control'),/no-transform/);
}
assert.match(readFileSync('public/_headers','utf8'),/\/games\/friend-block-test\/\*[\s\S]*?no-transform[\s\S]*?noindex[\s\S]*?connect-src 'none'/);
assert.match(readFileSync('wrangler.toml','utf8'),/html_handling\s*=\s*"none"/, 'The HTML5 index file must not redirect onto its parent detail route');
console.log('PASS Worker streaming/no-transform and static asset privacy headers');

const deltas=JSON.parse(readFileSync('scripts/fixtures/friend-quiz-approved-delta.json','utf8'));
const sha=s=>createHash('sha256').update(s).digest('hex');
for(const [file,delta]of Object.entries(deltas.files)){
  const source=beforeFriendQuizFixesSource(file,readFileSync(file,'utf8')).replace(/\r\n/g,'\n');
  const check=s=>assert.equal(sha(s),delta.afterSha256,file+' exact reviewed current source');
  check(source);assert.equal(sha(beforeFriendQuizSource(file,source)),delta.beforeSha256,file+' restored baseline');
  assert.throws(()=>check(source+'\n// unrelated\n'));
  assert.throws(()=>check(source.replace(delta.marker,delta.marker+'-unrelated')));
}
const registry=JSON.parse(readFileSync('data/game-license-registry.json','utf8'));
const original=JSON.parse(beforeFriendQuizSource('data/game-license-registry.json',readFileSync('data/game-license-registry.json','utf8')));
assert.deepEqual(registry.records.filter(r=>r.id!=='friend-block-test-original'),original.records);
assert.equal(registry.records.find(r=>r.id==='friend-block-test-original').releaseDecision.status,'APPROVED');
for(const path of ['app/privacy-policy/page.tsx','app/terms-of-service/page.tsx']){
  const text=readFileSync(path,'utf8');assert.match(text,/Friend Block Test/);assert.match(text,/Clear quiz records/);assert.match(text,path.includes('privacy-policy')?/October 13, 2026/:/October 12, 2026/);
}
console.log(`PASS ${Object.keys(deltas.files).length} exact deltas, twice as many rejected unrelated mutations, existing rights preserved and local-data disclosures`);
