# MIG-OVAL-001 · 本地数据绑定实施与验收证据

> 当前 v1.69 · 2026-09-03：用户明确要求“不用提供，取消该项任务计划和相关文件”。LICENSE-GATE 材料补充计划已取消，不再要求材料，也不依据历史记录重建或催办该任务。专属清单和两份预检文件已从活跃目录移至 docs/archive/license-gate-cancelled-2026-09-03，可恢复；旧 JSON 的原路径和待材料措辞仅为历史。
> 29 条验收、原 QA、共享 Registry/UNKNOWN、应用及 SWF 保留；取消不记作许可或发布验证通过。本轮只取消和清理引用，不部署或开始下一项。下文原版本计划保留当时语境，不能覆盖本次取消。

> 历史 v1.66 · 2026-09-03 · **本地数据绑定已获用户明确验收**；完整统一模板迁移仍延期、未完成。

用户回复“确认验收，现在进行下一步开发”。本次验收仅覆盖 LOCAL_DATA_BINDING，新增第 28 条源验收，原 27 条不变；下方 v1.65 的“待验收”、检查与失败字段保留为历史，不代表当前仍等待本阶段验收。

原 checks.json SHA-256：47bfac00708ee560e90b915bbc7fd6c57e4fc9a7def201fa3a4c9ea8a2fd3231。本轮只读确认 152 项源码、21 份当前目录旧 JSON、73 张截图、18 份产物保持，没有重跑应用检查、构建、本地 HTTP/SEO/浏览器/移动/CWV，也没有核实预览存活。原 39 项最终命令与视觉有条件通过维持原日期。

已按下一步指令准备 Pixel External Tool 一致性方案，尚未确认或实施。Oval 既有窄屏入口偏低、UNKNOWN/P0 与全部生产门禁不关闭；未提交、推送或部署。当前验收证据：docs/quality/evidence/mig-oval-001/acceptance-checks.json；下一项方案：docs/product/pixel-external-tool-consistency-proposal.md。本轮回滚只涉及治理/方案增量，无应用或线上回滚。

## 历史 v1.65 · 实施与 QA 原文


> 2026-09-03 · 看板 v1.65 · **待本地阶段人工验收**  
> 用户指令：`确认 MIG-OVAL-001 本地数据绑定方案，进行开发`  
> 本地工程与实际交互：通过；视觉：有条件通过；发布：**不通过 / 用户暂缓 / 未部署**。  
> `templateMigrationCompleted=false`，没有收到本阶段成果验收。

## 范围和结果

只实现保留 Oval 既有页面的本地数据绑定，不是原路线图的完整统一模板迁移。继续使用 `FlashGenerator → GamePlayer`；通用 model 对 UNKNOWN 仍拒绝，GameDetailTemplate、播放器、适配器、服务工作线程、全站 CSS、路由规则、Square/Pixel 数据和 SWF 文件未改。

- 19 项必要播放器参数由 Oval Record 明确派生，只将必要 props 传给客户端，不传整份 Record。
- 删除页面重复的 3 How-to / 6 Features / 5 Tips / 5 FAQ 定义，五条 Tips 全部保留。Hero、卡片说明、About、标题、四条排错、VideoGame description 使用可选且运行时校验的 `content.legacyPage`。
- 两个侧栏游戏及底部 Square 链接由已有 Catalog/public-route 规则解析；排除自身、重复、未知和不公开记录。指南、Gallery、Blog 等资源与六张 curated 示例保持原来源、文案和顺序。
- URL、Title/description/H1、canonical/index、sitemap、OG/Twitter、三份 schema、页面结构、文案及操作方式保持。**唯一输出属性例外**为 COVER/img 的 width/height 从 972×774 修正为 PNG 实测 974×775；文件本身、`aspectRatio="972 / 774"`、`maxWidth="972px"` 不变，前后几何已核对。

质量监管 skill 保留逐步验收和 P0 边界；React 规则使客户端维持最小 19 项输入。没有新增页面或移动关键词意图，也没有扩展许可、提交、推送、部署或启动 MIG-PIXEL-001。

## 文件清单

| 文件 | 本轮改动 |
|---|---|
| `lib/games/game-schema.ts` | 可选 legacyPage 类型和运行时校验；其余旧 schema 可精确还原 |
| `data/games/oval-face.ts` | 保存原页面呈现；只修正 COVER 两个尺寸 |
| `lib/games/oval-legacy-page.ts`（新增） | 限定已有 Oval 路径的 props/正文/Related 解析 |
| `app/oval-face-icon-generator/page.tsx` | 31 个限定绑定补丁；保持页面输出 |
| `scripts/check-oval-legacy-page.mjs`（新增） | 固定实现前基线、端到端绑定、失败关闭、built/HTTP 检查 |
| `scripts/check-square-homepage.mjs` | 仅精确剥离新增 Oval legacyPage、还原两个尺寸后检查原数据 hash；旧黄金值不变 |
| `scripts/check-locale-rights.mjs` | 修正隔离 stub 序列化整份 Oval Record 导致的精确差异；先校验新增块/尺寸和旧完整记录，再归一，并新增 7 防绕过反例 |
| `package.json`、`scripts/README.md` | 增加 oval-page:check 与复现说明 |
| `PAGE_PLAN.md`、`LAUNCH_CHECKLIST.md`、`SEO_LOG.md` | 本地结果、已知问题、待验收和未部署边界 |
| `docs/product/oval-local-data-binding-proposal.md` | 当前实施状态；原 v1.64 方案作为历史保留 |
| `docs/quality/evidence/release-2026-09-02/README.md`、`docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md` | 当前本地阶段状态，不覆盖旧发布/许可证据 |
| 本目录 `README.md`、`checks.json`（新增） | 验收说明、命令原文、哈希、浏览器和治理证据 |
| F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html | v1.65 当前焦点、质量证据及本地阶段专属验收门 |

对比本轮开始时的工作区，而非 Git HEAD：7 个既有源码/检查文件改动、2 个新增，152 项检查清单中其余 **143 项不变**；23 份历史 JSON、52 张旧截图及原 **27 条 SOURCE_ACCEPTANCE** 均保留。原方案与 Square 验收/QA 没有重写。

## 环境与复现

- Windows PowerShell；Node 22.16.0、Next 14.2.35。
- 分支 `codex/game-platform-rebuild`；HEAD `c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228` 未变。
- 当前本地生产构建 `U_kmLWP9KIdfcJUsHvBgL`；[Oval 预览](http://127.0.0.1:3100/oval-face-icon-generator)。
- 2026-09-03 12:50（Asia/Shanghai）再次核实 127.0.0.1:3100 监听 PID 46300，为本项目 Next start；stderr 为空。又复查 16 路 HTTP、4 路边界和 PNG，均通过。服务存活只是该时点证据。
- Browser plugin 可用，始终使用同一 Browser runtime/tab；没有切换外部 Chrome/Playwright 或绕过文件访问限制。窗口尺寸已恢复。
- 旧构建/预览先按进程身份核实后停用，再构建和启动当前本地预览；启动使用隐藏窗口，不是部署。

已运行 `tsc --noEmit`、`npm run lint`、三个检查脚本的显式 ESLint、canonical/games/player/routes/components/metadata/home/home-hero/home-discovery/home-gallery/perf-home/game-template/terms/about/editorial/gallery/locale/square-home/oval-page 检查。框架和平台分别执行 `npm run build`、`npm run cf:build`。

built 和 HTTP 回归覆盖 terms/about/editorial/gallery/locale/oval 六个检查器。robots/SEO 使用直接 Node 参数，仅指定一次 `--base http://127.0.0.1:3100`，避免 npm 脚本预设地址影响检查。精确命令、cwd、开始/结束时间、超时、stdout/stderr 和退出码在 checks.json；无需依赖缺失或不同的 npm start 约定。

若日后本地预览停止，可在项目目录、当前构建有效且端口空闲时运行：

```powershell
node .\node_modules\next\dist\bin\next start -H 127.0.0.1 -p 3100
```

## 检查结论

| 检查 | 结论与证据 |
|---|---|
| 类型 / lint / 相关及既有回归 | 22 项最终代码命令全部 exit 0 |
| 新 Oval 源码检查 | 19 显式参数及 19 转发；75 文字、2 图片、3 href 绑定；250 非法记录、26 关系排除；22 冻结源码和 3 二进制哈希保持 |
| 原输出契约 | 完整真实组件 SSR、metadata 和 3 schema 保持；只归一 img 两个批准尺寸 |
| Square / Locale | Square 8 语言真实 SSR、56 绑定、38 转发、150 反例保留；Locale 原 8 SSR/metadata、19 源码/116 HTML/4 sitemap 反例不变，增加 7 个精确归一防绕过反例 |
| Next / OpenNext | 两项构建 exit 0，42 个静态路由；Cloudflare 构建的 3 条既有 Windows 兼容 WARN 保留，未当作部署结果 |
| built / HTTP / robots / SEO | 15 项最终运行时命令 exit 0；总计 **39 项最终命令通过** |
| HTTP 与索引 | 16 路响应 200 且与当前产物字节一致；正文/metadata/schema 与改前等价；两条目录路径 200 noindex、两个真实缺失路径 404 noindex；无新 Oval 重复路由 |
| SEO v2.1 | 20 页 / **0 must / 12 既有 should**；KW-03×1、META-03×7、META-04×4 未顺手改写，KW-04 未验证；原 canonical、H1、图片 alt、内链、FAQ schema 和索引规则保持 |
| robots | 11 项策略决策通过，6 阻止 / 5 允许；生产 robots 未验证 |
| Browser 页面身份 / 非空 / 错误覆盖层 | 7 组改前/改后均为目标 URL、Title、单 H1 和真实内容，无框架错误覆盖层 |
| 控制台 | 20 批 error/warn 查询均为空 |
| 响应式 / 图片 | 7 组 DOM/文字/几何一致、无横向溢出；COVER 974×775 修正未改变显示区域 |
| 交互 | 24 条观察覆盖点击、Space/Enter、加载/ready、重载、FAQ/排错、帮助/Gallery/Pixel/Back 和 Square 双向链接 |
| 看板 | JS、静动态焦点一致性、本地验收取消/登记/重载、退回、重置、导出、误完成阻止均通过离线 VM 验证；实际 SOURCE_ACCEPTANCE 仍为 27，无 Oval 成果验收 |
| 看板视觉 / 当前 CWV / 生产 | 未验证；文件访问限制保留，不绕行 |

39 项为最终门禁集合，不掩盖 65 次有界 runner 调用中的 3 次初始失败：Square 冻结旧 Oval 源码；新 Oval 检查误将全页 11 个 details 当作 main 的 9 个；Locale stub 包含新增 Record 呈现数据。修正只限明确边界，未刷新旧黄金快照。SSR 只允许既有 React 18 fetchPriority 警告，不能等同浏览器错误。

另保留一次浏览器定位失败：手机隐藏菜单里的 “Oval Face” 不是可点击的可访问链接，刷新快照后使用可见 Featured 卡片完成跳转；没有因此改应用。留档检查器的三次初始断言及修正也单独保留：补用独立旧 Oval hash/BUILD_ID/Pixel main 契约；按原始文件加批准补丁重构；只允许新增绑定行的前导缩进差异。21 行新绑定源码的缩进省略为格式记录，未改变行内内容；不是对任意源码差异的放行。应用、旧黄金值和构建没有在此留档阶段变动。

## 浏览器交互与视觉边界

流程：Oval 原 URL → Play Now 锚点（仍 idle）→ 封面点击 / 360px Space / 1280px 控制条 Enter → 可见 Loading → 实际 Ruffle ready → Reload → FAQ/排错/帮助/相关页 → 返回。

- 1280×900、390×844、360×800 的 Oval；1280×900、390×844 的 Square；390×844 的 es/ar，共 7 组对照。包含 RTL、图片自然尺寸、metadata/schema、链接及正文。
- 6/7 对照截图字节相同。Oval 桌面一组字节不同，已分别目视复核，没有看到布局/文字变化；不宣称像素完全相同，不猜测差异原因。
- Play Now 只改锚点，不自动激活，和原行为一致。点击、空格和回车均实际激活；加载时可见 loading notice，随后出现 SWF 游戏画面。Reload 后恢复 ready，保持一个 Ruffle 实例。
- 390 / 360 / 1280 下加载与 ready 的预留区域分别保持 320×254.8125、290×230.921875、695×553.421875 CSS px。
- 首次 idle 的资源清单未见 Ruffle/WASM/SWF，激活后清单包含 ruffle.js、core JS、WASM、oval-face.swf。它是 DOM/资源清单证据，**不是 HAR、网络耗时、INP、LCP 或 CLS 测量**。
- **既有窄屏问题未修复**：360×800 播放器起点为文档 805.828125px；390×844 为 816.9375px，开始按钮都需要滚动才能看到。改前改后相同，不能声称满足首屏入口要求；本次方案冻结布局，因此只记录、不扩大到首屏重排。
- 实际全屏、全部 SWF 内部编辑/保存控件、物理设备和其它浏览器引擎未测。游戏显示 ready 不等于这些行为都通过。

21 张本轮截图在 C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-oval-001-v1.65。主要验收图：

- 桌面：C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-oval-001-v1.65/oval-desktop-full-game.jpg
- 手机游戏与控件：C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-oval-001-v1.65/oval-mobile-game-and-controls.jpg
- 首次手机 loading：C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-oval-001-v1.65/oval-mobile-loading.jpg
- 改前/改后全量清单与 SHA-256：checks.json 的 browser.screenshots。

## 验收、发布与回滚

请只验收已确认的本地阶段，回复：

**`MIG-OVAL-001 本地数据绑定验收通过`**

看板按钮明确为“本地阶段验收通过”。离线模拟证明：用户将来确认后只写带 LOCAL_DATA_BINDING 范围的记录，原完整迁移保持延期/未完成；取消不改变状态，退回能保存并重载，重置恢复 27 条内置验收，导出包含 v1.65 与完整迁移未完成标记。状态下拉框和过期的无范围已完成状态不能提前关闭模板目标。这些模拟没有写用户浏览器，也没有替用户验收。

实际 Square/Oval 精确来源、权利人和权限仍 UNKNOWN，LICENSE-GATE 已延期但 P0 未关闭。生产版本关联、一跳规范化、robots、SEO、CWV、广告/CMP及原有视觉/12 should/KW-04 等门禁仍开放。本项本地检查通过不授予发布资格。无 commit、push、deploy、seo:prod 或下一项开发。

本地回滚只撤销本轮有范围的增量，不能 git reset / 覆盖用户其它未提交工作。原文件备份在 C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-mig-oval-v165-f363f828ae014714bf9da2315e258f86/before-files，原构建快照在 before-artifacts；checks.json 记录原/现 hash、31 个页面批准补丁、31 个治理补丁和校验结果。删除新增字段/绑定及新增 helper/checker、还原 package/checker 对应增量后须重新验证；看板与文档也仅逆向本轮补丁。没有线上变更，因此没有线上回滚。临时备份不等同长期 Git 回滚点。

15 份既有构建备份与独立旧 Oval HTML 可用原完整 hash 复核；额外 BUILD_ID 按原值核对。Pixel 额外快照未在复制时单独记录完整 hash，只按已记录的 main 契约及原/现内容比较，不冒充完整旧文件哈希审计。

