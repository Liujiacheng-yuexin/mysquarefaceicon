# MySquareFaceIcon：朋友测验小游戏 QUIZ-001 开发规格（配合 /goal 使用）

规格版本：2026-10-12。本文件放在 mysquarefaceicon 仓库的 `docs/product/friend-block-test-goal-spec.md`，由 `/goal` 引用。Codex 和 Claude Code 都可以用。

## 0. 怎么用（这一节给用户看，执行任务的 AI 从第 1 节读起）

1. 这台电脑上还没有这个仓库。先克隆，再把本文件复制进去（如果你在另一台电脑上已有仓库，就在那边操作，只做复制这一步）：

```bash
git clone https://github.com/Liujiacheng-yuexin/mysquarefaceicon.git "/d/LYXGIT/mysquarefaceicon"
```

```bash
cp "/d/LYXGIT/找词/mysquarefaceicon-friend-quiz-goal-spec.md" "/d/LYXGIT/mysquarefaceicon/docs/product/friend-block-test-goal-spec.md"
```

2. 在仓库目录里打开 Codex 或 Claude Code，确认它有联网、执行命令和 `git push` 的权限。
3. 把下面整行粘贴进去发送：

```text
/goal Implement task QUIZ-001 for mysquarefaceicon.com exactly as specified in docs/product/friend-block-test-goal-spec.md. First read AGENTS.md and every document it requires, then the whole spec; re-read the spec after any context compaction. User decisions carried by this instruction, do not ask again: I confirm the layout, SEO and interaction proposal contained in the spec, including one new indexable game page at /games/friend-block-test, the per-record index allowlist it needs, one new category, and the recorded positioning exception. I also authorize, for this scoped task only, committing on main, pushing, deploying with npm run cf:deploy and submitting IndexNow once every gate below has passed. Outcome: the friend quiz game is live, playable end to end on phone and desktop, and its page is indexable and listed in the sitemap. Constraints: work on main as AGENTS.md says, never force-push; no backend, no new Cloudflare bindings, no network requests from the game; do not copy any competitor name, text, questions, layout or images; do not change the homepage first viewport, existing URLs, existing index status or the SWF files; do not weaken, skip or delete any existing check, and when a baseline must change because of this intended work, update it and document each change in the evidence folder; where the spec says STOP, stop and print a blocker report. Verification, run and shown in this conversation: npm run lint, npm run build and npm run cf:build pass; every existing *:check script that applies passes; the new npm run quiz:check passes; npm run seo:check passes against a local production build; browser checks at 320, 390, 768 and 1440 px pass for the create, answer and result flows. After deployment: npm run seo:prod passes, the live page returns 200 without noindex, and a share link created on production opens the same quiz in a fresh browser profile. The goal is achieved when all of that is shown, the evidence folder and SEO_LOG.md are committed, the board task is set to 待验收 (or the report explains why the board was unreachable), and you have printed the final work summary in the format AGENTS.md requires.
```

4. 两点说明：
   - 这一行里**包含了对这个任务的上线授权**：检查全部通过后它会直接提交、推送、部署。这个仓库平时的规矩是等你验收后再上线，所以如果你想先看再上线，把 `I also authorize ... has passed.` 这一句删掉，再把 `After deployment: ... fresh browser profile.` 这一句删掉。
   - 部署要用本机的 Cloudflare 登录状态。没登录的话它会停下来告诉你。

---

## 1. 任务与边界

**任务**：给 mysquarefaceicon.com 加一个自己做的朋友测验小游戏，任务编号 QUIZ-001，页面地址 `/games/friend-block-test`。

**为什么做**
- 2026-10-09 起，一个「朋友会不会拉黑你」的测验在社交平台上传开，带出一批搜索词：
  - `block you test`：热度是参照词的 0.977 倍，近 7 天 +284%；
  - `block you test me`：0.505 倍，+1,161%；
  - `dont block me quiz`：0.054 倍；
  - 这一组词的难度评分 13.2（很低），都没有搜索量数据。
- 2026-10-12 的谷歌首屏：原版站点排在 `block you test` 第 1；`block you test me` 的首屏是一条社交帖子、一家不相干的监考软件、两个别的站仿做的内页、Quora 和 Reddit。已经有两个站靠加一个内页排进首屏。
- 这些词多半是把原版站点的域名拆开来搜，想打开朋友发来的那份测验。那部分需求本站接不住，能接的是「我也想出一份」。页面上要如实说明这一点。

**用户已经确认的事（由 goal 指令携带，不要再问）**
- 新增一个可索引的游戏页 `/games/friend-block-test`。
- `/games/[slug]` 现在对所有新游戏强制 noindex。改成「只对明确列入白名单的记录放开」，白名单里只有这一条。其余记录保持现在的失败即 noindex 的行为。
- 新增一个分类 `friend-quizzes`（Friend Quizzes）。分类页沿用现有政策：noindex、不放广告。
- 产品定位（`docs/product/positioning.md`，STRAT-001）加一条有日期的记录：允许加入这一个以头像为载体的朋友测验，作为补充内容；旗舰和首页的职责不变；这不代表开放成通用小游戏站。
- 直接在 `main` 上工作，不建分支（`AGENTS.md` 的现行规定）。

**禁止**
- 不做后端：不加 KV、D1、R2、API 路由，游戏不发任何网络请求。
- 不抄：不用原版和其他仿站的名字、文案、题目、界面、图片。本站的游戏叫 Friend Block Test。
- 不动首页首屏、现有 URL、现有页面的索引状态、Square 和 Oval 的 SWF 文件。
- 不写虚假的人数、热度、评分。
- 不削弱、跳过或删除现有检查。因为这次有意的改动而必须更新的基线和夹具，更新后在证据目录里逐条说明原因。
- 不打印任何密钥。

**遇到阻塞**：标了 STOP 的情况立即停下，打印阻塞报告（卡在哪一步、看到的输出、原因判断、可选方案）。

## 2. 开工前

1. 按 `AGENTS.md` 的要求读完它列出的全部文档。这次涉及产品方向和发布，所以 `STRATEGY.md`、`QUALITY_STANDARD.md`、`SEO_PLAN.md`、`SEO_LOG.md` 也要读。
2. 读这些和游戏体系有关的文件：`data/games/README.md`、`lib/games/game-schema.ts`、`lib/games/catalog.ts`、`lib/games/routes.ts`、`app/games/[slug]/page.tsx`、`lib/seo/game-metadata.ts`、`data/game-license-registry.json`、`data/game-categories.ts`、`docs/content/game-page-quality-standard.md`、`docs/legal/game-rights.md`、`docs/product/route-architecture-proposal.md`。
3. `git status` 和远端状态：有不属于本任务的未提交改动就保留不动；无法在不影响它们的前提下工作就 STOP。
4. 跑一遍 `npm run lint`、`npm run build` 和现有全部 `*:check`，把动手之前就失败的记下来作为基线。build 失败就 STOP。
5. 用仓库里现有提案的格式，写一页的 `docs/product/friend-block-test-proposal.md`（版式、SEO、交互），内容取自本规格第 3 到 5 节，并注明用户已通过 goal 指令确认及日期。
6. 开发看板：`AGENTS.md` 里写的看板路径在另一台电脑上。能访问就新增 QUIZ-001 这一项；访问不到就不要另建看板，把证据放进仓库的证据目录，并在最终总结里说明。

## 3. 游戏设计

**玩法**（三个流程，全部在浏览器本地完成）

1. 出题人：选一个头像，填昵称，回答 10 道关于自己的选择题，得到一个分享链接。
2. 朋友：打开链接，看到「某某的朋友测验」，选头像、填昵称，猜出题人的答案；答完看到得分和所在档位，可以把自己的成绩链接发回给出题人，也可以自己出一份。
3. 出题人打开成绩链接：看到这位朋友的得分，并存进本机的成绩列表。

**要求**
- 题库：至少 20 道原创题，每题 4 个选项，内容轻松友好，适合所有年龄。出题人可以换掉不想答的题。
- 档位：按得分分 4 档，名字要好玩但不伤人，不用侮辱性的词。
- 头像：用仓库里已有的项目自有头像素材（`public/game-face-samples/`）。结果页有一个按钮引导去首页做自己的方脸头像。
- 自由输入只有昵称：最多 16 个字符，去掉控制字符和链接，只作为纯文本显示。
- 分享链接指向游戏页本身，测验数据放在 `#` 后面的片段里，不用查询参数。数据要紧凑，带版本号和校验；被改坏的链接要给出友好提示，不能报错白屏。完整链接控制在 1,800 个字符以内。
- 手机优先：大多数人会从社交应用里点开。单手可操作，按钮够大，320 px 宽度不出现横向滚动。
- 可访问性：键盘可完成全部流程，焦点可见，对比度达标，状态变化有文字提示。
- 不依赖第三方库，不加载外部资源。

**接入方式**
- 游戏做成自包含的静态 HTML5 小应用，放在 `public/games/friend-block-test/`，通过现有的 HTML5 播放适配器加载。
- 新增一条游戏记录 `data/games/friend-block-test.ts` 并在 `lib/games/catalog.ts` 登记：交付类型 `HTML5`，状态 `PUBLISHED`。
- 这是仓库里第一个真正走 `/games/[slug]` 路由的游戏（2026-10-12 时目录里的三条记录都是已有的旧地址），所以这条路由、模板、元数据在真实数据下可能第一次被跑到，发现缺口就在本任务里补上并记进证据。
- 要让 `lib/games/routes.ts` 认它是可路由的新游戏，记录必须同时满足：`slug` 是 `friend-block-test`，`route.path` 是 `/games/friend-block-test`，`route.existingPublishedRoute` 是 `false`，`route.indexStatus` 是 `INDEX`，许可里 `newPublicationAllowed` 是 `true`、`allowedDeliveryTypes` 含 `HTML5`、`releaseDecision` 是 `APPROVED`。
- 许可登记：在 `data/game-license-registry.json` 新增一条，写明这是本项目的原创作品、作者和权利人是本项目、发布决定为 `APPROVED`。不要改动其他记录，不要把任何 `UNKNOWN` 改成许可。
- 封面图、缩略图、OG 图自己画（代码生成或用项目自有素材拼），登记进素材清单，标明是项目素材。

## 4. 页面与 SEO

| 项 | 内容 |
|---|---|
| URL | `/games/friend-block-test` |
| 索引 | INDEX，自引用 canonical，写进 sitemap |
| Title 初稿 | Friend Block Test: Would Your Friends Block You? Free Quiz Maker |
| H1 初稿 | Friend Block Test |
| 描述初稿 | Make a 10-question friend test, share one link, and see who really knows you. Free, no signup, and nothing is uploaded. |
| 主词 | friend block test |
| 次要词 | block you test、block you test me、dont block me quiz、fake friend quiz |

Title、H1 可以润色，但 Title 里要同时有 block、test、friends 这三个词。

**页面内容**（用现有的游戏详情模板，字段按 `game-schema.ts` 填，质量按 `docs/content/game-page-quality-standard.md`）
- 游戏在首屏可见、可直接开始。
- 怎么玩（三个流程各一段）、功能点、小贴士。
- FAQ 至少包含：
  - 这是不是别的网站上那个「block you test」或「Don't Block Me」测验：不是，这是本站自己做的独立小游戏；在别的网站生成的链接只能在那个网站打开。
  - 会不会保存或上传我的回答：不会，测验内容都在链接里，成绩只存在你自己的设备上。
  - 朋友需要注册吗；手机能玩吗；链接打不开怎么办。
- 一段如实的说明：这个玩法 2026 年 10 月在社交平台上流行，本页是独立实现。
- 相关内容：链到首页的方脸头像生成器和 `/games`。

**SEO 登记**
- `app/sitemap.ts` 加上这个地址。
- 结构化数据、Open Graph、面包屑按现有游戏页的做法输出。
- 更新 `SEO_LOG.md`、`PAGE_PLAN.md`、`CONTENT_PLAN.md`。
- 分类页、`/games` 目录、相关游戏、首页发现模块：只按它们现有的规则自动带出这条新记录，不为它改首页首屏，不新增广告位。

## 5. 隐私与合规

- 页面和游戏里都写明：不上传、不保存到服务器；成绩列表只在本机。
- 核对隐私政策和条款里关于本地存储的描述，和这次新增的本机成绩列表保持一致；需要补一句就补，并让相应的一致性检查通过。
- 游戏页的广告沿用现有游戏详情模板的政策，不做额外改动。

## 6. 验收

新增 `npm run quiz:check`（做法参照仓库里现有的 `validate-*` 脚本），至少覆盖：

| 编号 | 检查 |
|---|---|
| Q1 | 测验数据编码再解码后完全一致；成绩链接同理 |
| Q2 | 被截断、被篡改、版本不认识的片段都能被识别，并走到友好提示 |
| Q3 | 10 题全填满、昵称取最长时，完整链接不超过 1,800 个字符 |
| Q4 | 昵称清洗：超长、控制字符、链接、HTML 标签都被处理成安全的纯文本 |
| Q5 | 计分和档位边界正确 |
| Q6 | 题库不少于 20 题，每题恰好 4 个选项，没有重复题 |
| Q7 | 游戏目录下的文件不引用任何外部域名 |

另外要通过并展示结果的：
- `npm run lint`、`npm run build`、`npm run cf:build`。
- 现有全部适用的 `*:check`（数据、元数据、路由、播放器、组件、模板、目录、分类、相关游戏、素材、图片、首页各项、权利一致性等）。
- 元数据检查要能证明：白名单里的这一条是 INDEX；任意一条不在白名单里的新记录仍然是 noindex。
- 对本地生产构建跑 `npm run seo:check`。
- 浏览器实测 320、390、768、1440 四个宽度下的出题、答题、看成绩三个流程，截图存进证据目录。
- 实测一次完整链路：在一个浏览器里出题，把链接放到另一个全新的浏览器环境打开并答题，再把成绩链接拿回第一个浏览器打开。

证据放在 `docs/quality/evidence/quiz-001/`，格式照现有任务的证据目录。

## 7. 上线（goal 指令里带了授权才执行）

1. 全部检查通过后，在 `main` 上提交并推送。
2. `npm run cf:deploy`。本机没有 Cloudflare 登录状态就 STOP，不要尝试别的部署方式。
3. `npm run seo:prod`；确认线上页面返回 200、没有 noindex、在 sitemap 里；在线上重做一次第 6 节最后那条完整链路。
4. `npm run indexnow` 提交新地址。
5. 任何一项不对：告诉用户，并给出回滚办法（参照 `docs/migration/rollback-plan.md`）。
6. 看板或证据里把任务状态记为「待验收」，不要记成已完成。

## 8. 最终总结

按 `AGENTS.md`「Final work summary」的要求输出，并且写清：
- 新增和改动的文件、受影响的 URL；
- 每项检查的结论，用「通过 / 有条件通过 / 不通过 / 未验证」区分；
- 更新过的基线和夹具，各自的原因；
- 部署和线上核对的证据，或者没有部署的原因；
- 需要用户做的事：在 Search Console 里对新页面请求收录；验收后把任务标为完成。

## 9. 不在本次范围

- 服务器端的排行榜、账号、评论接入。
- 其他语言版本。
- 第二个测验或其他新游戏。
- 首页、导航结构、广告位的调整。
