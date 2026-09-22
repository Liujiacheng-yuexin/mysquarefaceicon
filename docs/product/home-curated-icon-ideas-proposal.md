# HOME-GALLERY-001 · Curated Icon Ideas 方案（已实施并验收）

> 方案状态：用户已确认；本地实施完成并于 2026-09-01 验收通过  
> 当前任务：`HOME-GALLERY-001`  
> 前置状态：用户于 2026-09-01 明确回复 `HOME-DISC-001 验收通过`，随后要求进行下一步开发  
> 主要影响：英文根首页 `/` 中 Discovery 后、长内容前的 Gallery 预览  
> 必要真值清理：移除共享 Gallery 预览在 Oval、Pixel 与 draft locale 首页中的无来源点赞/社区表述  
> 确认记录：用户于 2026-09-01 明确回复 `确认 HOME-GALLERY-001 方案，进行开发`  
> 验收记录：用户于 2026-09-01 明确回复 `确认验收，进行下一步开发`  
> 发布权限：本任务只实施已确认范围并回写证据；不提交、不推送、不部署

## 1. 当前事实与问题判定

- 根首页当前标题为 `Community Gallery Preview`，说明同时声称内容来自 community 和 original examples；六张静态图片下显示 `120 / 98 / 76 / 142 / 110 / 85` 点赞。
- `components/HomePage.tsx` 直接用数组构造上述点赞值，`components/GalleryPreview.tsx` 把 `likes: number` 作为必填字段并渲染 Heart；没有 API、数据库或分析数据为这些数字提供来源。
- 生产接口 `https://mysquarefaceicon.com/api/comments?locale=en&limit=500&sort=latest` 于 `2026-09-01T09:28:51.6524598+08:00` 返回 HTTP `200`，`comments` 数组为 `0` 条。当前本地 `/gallery` 也真实显示 `No creations yet` 与 `No approved comments yet`。
- 六张现有样例 `cute / retro / funny / minimal / gamer / classic` 均为项目内 `512 × 512` WebP；Git 只证明它们在 2026-06-09 被加入仓库，不能单独证明作者、原创性或许可。
- 因此本任务采用最窄真实口径：称为 `site-curated examples`，不称 community submissions，也不称 original/official/authorized；不显示点赞、评分、热度、用户数或其他社会证明。
- 同一个 `GalleryPreview` 还在 Oval 与 Pixel 页面使用，那里同样存在无来源点赞。`SEO_RULES.md` 明确要求 Gallery、推荐与热度数字必须来自真实数据或标为 curated；因此确认后的实施会清理全部共享调用，但只有根首页采用本方案的新视觉构图。
- `/gallery` 的 approved UGC 能力、审核 API、表单、排序与空状态保持原样；本任务不伪造内容去填充它，也不删除社区能力。

## 2. 视觉方向与概念图

- [桌面 Curated Icon Ideas 概念](./concepts/home-gallery-001-desktop-concept.png)
- [390px 移动 Curated Icon Ideas 概念](./concepts/home-gallery-001-mobile-concept.png)

概念图只用于确认层级、密度、构图、文案位置与响应式方向，不作为生产图片或 UGC。生产实现继续使用现有六张 `public/game-face-samples/*.webp`，不发布概念图，不新增长期图片依赖。

视觉继续使用现有 cream 背景、dark brown/plum 正文、mint 轮廓和 orange 主操作。该模块从大型 mint 面板改为开放式 editorial band：更少容器、更清楚的真假边界、更紧凑的移动浏览路径；不新增字体、渐变、轮播、动画、第三方脚本或装饰插画。

## 3. 桌面布局（验收宽度 `1440` / `1280`）

```text
Curated Icon Ideas 说明列                 样例图集
├─ h2 标题                               ├─ Cute（略大主样例）
├─ 一句用途说明                          └─ Retro / Funny / Minimal / Gamer / Classic
├─ “非社区投稿”真值说明                      横向紧凑图轨 + 逐项标题
└─ Browse All Icon Ideas → /gallery
```

- 整体服从首页现有最大宽度；说明列约占 `30%–34%`，图集约占 `66%–70%`。
- Cute 只作为视觉主样例，不标 Featured、Popular 或 Best；其他五项保持同一视觉权重和稳定方形比例。
- 图像使用 `<figure>` / `<figcaption>`，不是假按钮或假互动卡；唯一主要交互是普通 `<a href="/gallery">` CTA。
- 不再使用六个重复的大卡框，不显示 Heart、数值、评分、评论数、作者头像或 hover 计数。
- 在较窄桌面/平板可把说明列堆叠到图集上方；DOM、阅读与键盘顺序不改变。

## 4. 移动布局（验收宽度 `390`，补查 `360` / `430`）

- 标题、用途说明、真值说明、图集、CTA 按真实 DOM 顺序纵向排列；sticky header 不遮住标题。
- 六个样例采用紧凑 `3 × 2` 图集；每列允许收缩，图片保持 `1 / 1`，标题不挤出视口。
- CTA 为清晰的整行触控目标，最小高度 `44px`；图像本身保持非交互，避免制造不可用的点击预期。
- 不允许横向滚动；`documentElement.scrollWidth` 不得大于可用 client width。
- 当前 390px 模块实测约高 `1620.92px`。确认后的目标是在保留全部六张图、标题、真值说明和 CTA 的前提下控制在约 `800px` 内；不得通过隐藏图片或缩小文字到不可读来达成。

## 5. 固定文案与数据合同

- 标题：`Curated Icon Ideas`
- 说明：`Explore six square face styles for color, expression, and profile-crop inspiration.`
- 真值说明：`Site-curated examples — not community submissions.`
- CTA：`Browse All Icon Ideas`
- CTA href：`/gallery`
- 样例标题：`Cute`、`Retro`、`Funny`、`Minimal`、`Gamer`、`Classic`
- 资产路径：继续使用 `/game-face-samples/{cute,retro,funny,minimal,gamer,classic}.webp`
- 图片规格：现有六张均为 `512 × 512` WebP；生产 `<Image>` 使用显式宽高、稳定比例、响应式 `sizes` 与 lazy loading，不设置首屏 priority。
- Gallery 专用 alt 改为中性可见描述，不再使用未经证据支持的 `made in the game`、community、original 或 official 表述。
- 数据类型不包含 `likes`、`rating`、`popularity`、`author` 或 `community` 字段；将来只有接入真实 approved 数据源并另行验收后，才允许增加此类字段。

## 6. 共享真值清理边界

- 新建共享 `CuratedGalleryPreview`，将 `title / intro / trust note / items / href / variant` 作为明确输入，类型层不再接受 `likes`。
- 根首页与共享 `HomePage` 调用使用 `home-editorial` variant；noindex draft locale 继承无指标的真值组件，但本任务不改变其 metadata、索引状态或翻译审核状态。
- Oval 与 Pixel 页面改用保守 `compact` variant，保留原模块位置与各自相关样例，仅把标题/说明改为 curated 口径并删除无来源数字；不执行这两个页面的首屏、播放器或长内容重设计。
- 旧 `GalleryPreview` 在无调用后删除，避免以后重新引入 Heart + hardcoded likes。
- `/gallery` 页面、`CommentSection`、comments API、审核后台与真实 like API 均不修改。

## 7. SEO、内链、性能与可访问性边界

- `/`、Oval、Pixel 与 draft locale 的 URL、title、description、H1、canonical、Open Graph、Twitter、schema、robots/indexability、language alternates 与 sitemap membership 全部冻结。
- 不新增页面、rewrite、redirect、canonical、FAQ、schema、导航项或 indexable 内容；根首页主意图仍是 `square face generator`。
- CTA 继续使用服务端输出的普通内部链接；锚文本从 `View Full Gallery` 收敛为更真实的 `Browse All Icon Ideas`，不加 `nofollow` 或 JavaScript 导航。
- `<section aria-labelledby>` 对应唯一 `h2`；图片由 `<figure>` 分组，说明文字不是伪标签；CTA 具有可见 `:focus-visible`，颜色不是唯一状态表达。
- 所有样例位于核心 Hero 和 Discovery 之后，默认 lazy load，不抢占 Square cover 的 LCP；不引入客户端数据请求、carousel、observer 或运行时依赖。
- CT-03、SEO_RULES Gallery 真值规则与可见行为一致；“site-curated”只描述站内选择方式，不扩大作者或许可承诺。

## 8. 确认后的最小实施范围

1. 新增 `CuratedGalleryPreview` 与可测试的无指标 item contract，使用语义 figure/figcaption、普通 CTA 和两种受控 variant。
2. 将根首页六张静态样例从硬编码 likes 映射改为明确的 curated 数据；落实桌面说明列 + 主样例/图轨、移动 3×2 图集。
3. 更新 HomePage、Oval、Pixel 的共享调用，删除所有静态点赞与 `Community Gallery Preview` 误导性标题；不改 `/gallery` 真实社区能力。
4. 新增 `home-gallery:check`，至少断言：根首页固定文案/六张真实资产/普通 `/gallery` href/无 likes、Heart、rating、community claim；共享调用无无来源指标；图片规格、heading 与 SEO 冻结项保持。
5. 更新既有 `home:check` 中对 Gallery 组件的顺序断言，并更新 PAGE_PLAN、SEO_LOG、证据目录与权威看板。
6. 实施结束只进入 `待验收`；不自动开始 `PERF-HOME-001`。

## 9. 确认后的验证计划

- 运行 `home-gallery:check`、`home-discovery:check`、`home-hero:check`、`home:check`、`metadata:check`、`games:check`、`player:check`、`routes:check`、`components:check`，以及任务范围 TypeScript、ESLint、脚本语法和 `git diff --check`。
- 运行完整 `lint`、Next build 与 `cf:build`；若仍被既有 `app/sitemap.ts` P0 阻塞，按失败记录，不能把任务级通过写成发布通过。
- 只有存在本地 production build 时才运行 `seo:check`；没有部署授权，不运行或宣称 `seo:prod` 通过。
- 浏览器实测根首页 `1440 × 900`、`1280 × 900`、`390 × 1000`，补查 `360 / 430`：文案、六图、CTA、焦点、hover、图片稳定性、模块高度与无水平溢出。
- 在 Oval 与 Pixel 的桌面/390px 各抽查一次共享真值清理：无点赞/社区误称，原 player/external 边界、H1、URL 与后续内容保持。
- 点击根首页 CTA 并确认到 `/gallery`；该页在真实 approved UGC 为空时仍诚实显示 empty state，不把该 empty state带回首页。
- 实施完成时重新 `view_image` 检查本方案概念图和最终浏览器截图，并记录至少五项视觉一致性比对。

## 10. 明确不在本任务范围

- 不创建或伪造 community submission、用户头像、评论、点赞、评分、受欢迎程度或发布日期。
- 不改变 `/gallery` 的审核、提交、排序、like API、数据库或空状态。
- 不对现有六张图片声称 original、official、authorized 或已取得商业许可；不修改、反编译或重新导出 SWF。
- 不重新设计 Oval/Pixel 首屏、播放器、metadata 或搜索意图；只执行共享 Gallery 真值清理。
- 不处理 `PERF-HOME-001` 的 click-to-load/LCP/CLS 预算，不宣称性能目标已达成。
- 不修复既有 `app/sitemap.ts`、HTTP→HTTPS、移动 LCP 4.6s、Square/Oval 精确许可 UNKNOWN 或 3 项 KW-02 mandatory findings。
- 不提交、不推送、不部署。

## 11. 实施记录与验收门禁

已按确认方案完成以下内容：

- 新增无指标 `CuratedGalleryPreview` 与六项事实型数据合同，删除旧 Heart/likes 组件。
- 根首页采用 `home-editorial`，Oval/Pixel 采用 `compact`，draft locale 通过共享 HomePage 继承真实口径。
- 根首页 1440/1280/430/390/360、Oval/Pixel 1280/390 浏览器检查完成；390px 根模块约 `686.69px`，无横向溢出。
- CTA 已真实进入 `/gallery` 并看到诚实空状态；URL、metadata、H1、canonical、schema、索引与播放器边界保持。
- 专项与相关任务检查通过；完整 type/lint/Next/Cloudflare 构建仍被原样保留的 `app/sitemap.ts` P0 阻断。
- 证据见 `docs/quality/evidence/home-gallery-001/README.md`。

用户已于 2026-09-01 明确回复 `确认验收，进行下一步开发`，因此 `HOME-GALLERY-001` 已验收完成，`PERF-HOME-001` 已按用户指令进入只读调研。键盘触发后的焦点外观仍为未验证，全局发布仍因既有 P0 阻断保持 `不通过`；本次验收没有授权提交、推送或部署。
