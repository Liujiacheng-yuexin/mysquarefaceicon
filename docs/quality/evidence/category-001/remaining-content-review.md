# CATEGORY-001 · 剩余四页事实与内容记录

2026-09-04 · v1.78。依照 [内容审核模板](../../../content/game-page-review-template.md) 记录本批四个分类，不另立任务看板。用户已确认实施方案，**四页成果验收未收到；humanReview 未完成**。Agent 的源码/浏览器核对不代替人类逐项复核。

## A. 身份、版本与证据归属

共同边界：CATEGORY_REMAINING_PAGES，既有 noindex 分类导航页，不是可运行的游戏详情。分支 `codex/game-platform-rebuild`，HEAD `c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228`，存在累计未提交改动；本批文件指纹和实际时间见 [remaining-checks.json](remaining-checks.json)。最终本地 buildId `NbeJOq_fH0nAhjitrZ8be`。

authorOrEditor、人类复核人/时间/证据：未提供，不虚构。agentReview：本批源码与限定操作已核对；humanReview：未完成；userAcceptance：未收到。Face Makers 样例验收只引用原 [2026-09-04 记录](acceptance-checks.json)，不挪作本批事实审核。

来源索引：

- S1 当前源码：[分类解析器](../../../../lib/games/categories.ts)、[过滤与身份规则](../../../../lib/games/directory.ts)、[分类说明依赖](../../../../lib/games/category-remaining-content.ts)、`data/games/{square-face,oval-face,pixel-art-avatar}.ts`；本轮 SHA 见 JSON。数据存在和类型正确不代表许可通过。
- S2 当前源码：[Pixel 访问详情](../../../../app/pixel-art-avatar-icon-generator/page.tsx)、[GamePlayer](../../../../components/game/GamePlayer.tsx) 及相应数据。操作范围以 JSON 冻结清单和源码为准。
- B1 本轮真实浏览器：2026-09-04 Chrome/Playwright，`http://127.0.0.1:3100`，1280×900、390×844、360×800，普通窄窗口（不是触屏真机）。原始结果、开始/结束记录及截图均在 JSON 指向的临时目录，未模拟广告网络成功。
- H1 历史样例操作：[v1.75 QA](checks.json)，原验证日期不更新；两次整体 load 超时仍为 FAIL。只用于先前按需加载操作的限定参考，不当作本轮内部游戏复测。
- F1 fixtures：真实 SSR/metadata 与缺失、重复、改名、路径/类型/交付变化负例；它们是程序反例，不是真实用户操作。

## B/C. 四页逐项主张与独立价值

### `/category/avatar-makers` · Avatar Makers · 3 条

用途：在本站 Square/Oval maker 页面与 Pixel External 访问详情之间选择。最近似 Face Makers；多出 Pixel 访问入口及交付类型对比，但独立搜索价值未验证。共用卡片/其它分类/页头页脚不计独有贡献。

| claim ID / 位置 | 完整新增主张 | 核对依据与限定事实状态 | 未覆盖 / 人类复核 |
|---|---|---|---|
| AM-01 / Choose where to create 第 1 段 | Square Face Generator and Oval Face Icon Generator open maker pages on this site. Start with either entry if you want a square or rounded face icon. | S1 身份/路径和已有形状描述；B1 点击两卡均到对应本站页面；源码确认、限定浏览器操作确认。 | 不证明内部生成/保存成功或设备支持；人类未复核。 |
| AM-02 / 第 2 段 | Pixel Art Avatar Icon Generator is an external tool entry. Its card opens our access-details page first, where you can review the source and usage notes before visiting the original website. | S1 EXTERNAL_TOOL / EXTERNAL_LINK / DIRECT_LINK_ONLY；S2 详情已有说明；B1 卡片打开本站详情，未直接跳原站。 | 未操作原站编辑器，许可 UNKNOWN；人类未复核。 |

依赖：AM-01 需要当前分类内准确 Square/Oval；AM-02 需要准确 Pixel。依赖不成立省略对应段落，F1 已验证；不隐藏其余真实卡片或伪造条目。

### `/category/pixel-avatars` · Pixel Avatars · 1 条

用途：解释 External 卡片的访问顺序与非嵌入边界。与 Character Creators 完全共用一条记录；文字不同不构成独立 SEO 价值认证。CT-02/05 未通过索引放行门禁，维持 noindex。

| claim ID / 位置 | 完整新增主张 | 核对依据与限定事实状态 | 未覆盖 / 人类复核 |
|---|---|---|---|
| PA-01 / Before opening the pixel avatar tool 第 1 段 | The Pixel Art Avatar Icon Generator entry is an external tool. Its card opens the access-details page on this site, not an embedded editor. | S1/S2 类型与详情实现；B1 点击到本站详情，分类无 iframe/编辑器/玩家资源请求。源码及限定操作确认。 | 未核验外站功能或权利；人类未复核。 |
| PA-02 / 第 2 段 | Read the source and usage notes on that page before following the link to the original website. For the site's Square and Oval entries, browse Face Makers. | S2 已有 source/usage 说明；B1 Face Makers 原生链接及其中两张卡；这是阅读指引，不是许可结论。 | 外站后续操作未验证；人类未复核。 |

依赖：PA-01 需要 Pixel；PA-02 同时需要 Pixel 和唯一、含准确 Square/Oval 的 Face Makers。F1 对缺失/重复/身份变化逐项省略说明和上下文链接。

### `/category/retro-flash` · Retro Flash · 2 条

用途：给 Flash-based maker 的站内入口与按需加载步骤；与 Face Makers 同两条记录，独立需求/搜索价值未验证。不得从 Ruffle 源码推导所有游戏操作可用。

| claim ID / 位置 | 完整新增主张 | 核对依据与限定事实状态 | 未覆盖 / 人类复核 |
|---|---|---|---|
| RF-01 / Opening the Flash-based makers 第 1 段 | Square Face Generator and Oval Face Icon Generator use Flash-based game files with a browser player. Open a maker page on this site, then select Play to load its player. | S1 RUFFLE_SWF + clickToLoad 与 S2 Play 实现；B1 分类卡片到 maker 页面；H1 先前按需启动证据保留原日期。源码确认，启动步骤本轮未重新点击实测。 | 本轮未进入游戏、保存、全屏或触控操作；人类未复核。 |
| RF-02 / 第 2 段 | This category does not run a game or download its player on its own. See the maker page for controls, saving guidance, and source or usage limitations. | S2 页面存在对应说明；B1 本批直接进入、load 后 12.5 秒、键盘/指针/滚动后分类玩家请求为 0。限定浏览器操作确认。 | 说明存在不保证保存结果成功；实际权利仍 UNKNOWN；人类未复核。 |

两段均依赖当前分类内准确 Square/Oval 和 clickToLoad。F1 改为其它类型、身份、页面/路径或关闭 clickToLoad 后不再显示这些主张。

### `/category/character-creators` · Character Creators · 1 条

用途：明确当前集合只有 Pixel External，提供 face-based 选择入口。与 Pixel Avatars 一样的单条集合；不虚构全身角色、动画、下载能力，也不通过长文凑质量分。

| claim ID / 位置 | 完整新增主张 | 核对依据与限定事实状态 | 未覆盖 / 人类复核 |
|---|---|---|---|
| CC-01 / About this collection 第 1 段 | The current character-creator entry is Pixel Art Avatar Icon Generator. It is listed here as an external tool, so this collection is a starting point for browsing rather than an on-site character editor. | S1 当前唯一 Pixel 条目与交付类型；B1 卡片确到本站访问详情，分类不运行编辑器。源码与限定操作确认。 | 非外站能力背书；人类未复核。 |
| CC-02 / 第 2 段 | For a face-based character, browse Face Makers for the Square and Oval entries. Compare their square and rounded face styles before choosing a maker page. | S1 准确 Face Makers 集合；B1 上下文链接到该页。形状表述沿用现有记录，未新增生成能力。 | 未操作游戏全部功能；人类未复核。 |

CC-01 还需 games.length 为 1，未来多条时省略单数主张；CC-02 独立依赖有效 Face Makers。F1 分别覆盖集合扩张、缺失和重复。

## D. FAQ 与共用主张

四页均未添加 FAQ，也无 FAQPage/评分/评论/日期/用户数量 schema。共用 `Categories overlap: the same entry can appear in more than one group.` 由 S1 同一 ID 跨分类实际出现支持；四个 Other avatar categories 数量均来自当前过滤后的集合，SSR/HTTP/水合逐项比对，不写死虚构库存。

## E. 操作、设备和未经验证边界

四页分别完成 B1 三视口全文/首卡、全部 main 链接、菜单、Tab 焦点/Enter、返回/前进；共 177 场景含三种 404 的首页/目录退路。五分类 + 三 404 + Games 共 9 路 load 后 12.5 秒及交互通过；第一次整体因 Character Creators 的 GA 外部连接关闭 FAIL，最终独立 9 路重跑通过，原失败保留。四个首页真实广告 200/load/global → 分类全新文档无广告通过。

controls 仅 B1 外围 POINTER/KEYBOARD；touchstart 是合成事件，不是真实触摸验证。howToPlay 仅 RF-01 来源限定；内部 controls、保存、fullscreen/retry、外站生成均未验证；没有新增 features/tips 承诺。source/license 只引用现有 Registry，UNKNOWN 不升级，LICENSE-GATE 材料任务不恢复；无新图片、作者或性能测量。

## F. SEO 和内容审核

四页 KW-01：既有 Title/H1/简介不变，四个列表 H2 按批准文案改名。KW-02/03 不为导航页增词凑频率；通用检查覆盖原 20 个 sitemap URL，0 must / 12 should，**不替代本批独立内容质量认证**。KW-04 SERP/实体覆盖未验证；CT-01 为现有导航意图，CT-02/05 薄内容/近重复独立价值不获放行；CT-06 humanReview 未完成。qualityScore 未验证，不赋分。

META-06/09：两类 JSON-LD 与可见卡片、路径、名称、顺序/数量逐项一致，无游戏能力/评分声明。四页补 OG/Twitter 沿用现有品牌 `/og-image.svg`，不是游戏输出图；五页保持原 Title/description、noindex/follow、self-canonical、不进入 sitemap。主词 `/` 与原规则/robots 无变化。

## G/H. 结论、验收与后续触发

本地实现和限定工程/浏览器检查通过；**人类审核未完成、全站发布不通过/未部署**。命令、实际环境、失败、截图、文件/构建 SHA、回滚见 [交付说明](remaining-README.md) 与 [JSON](remaining-checks.json)。仅提交四页待验收，不自动下一任务或索引/部署。

未来任何记录身份/交付类型/路径/集合、玩家或外站变化均重新核验受影响 claim；省略段落只是安全降级，不等于内容缺口已经解决。保留所有旧失败、用户样例验收、UNKNOWN、完整 Oval 延期和已取消材料任务。
