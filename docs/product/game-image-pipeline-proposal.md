# IMG-001 · Thumbnail / Cover / OG 图片规范与优化管线方案

> 2026-09-08 · 看板 v1.96 · **方案待确认，尚未实施**  
> 当前任务：`IMG-001`  
> 依赖：`COMP-001` 已本地验收；`ASSET-001` 已获用户明确本地验收  
> 确认口令：`确认 IMG-001 图片规范与优化管线方案，进行开发`

## 1. 当前事实

- `public/` 共有 29 个图片文件、448,379 bytes：18 个 WebP、9 个 PNG、1 个 SVG、1 个 ICO。图片总体积不大，本任务不以批量转码制造无必要的二进制变更。
- 3 条 Game Data 共有 8 个图片记录、6 个唯一 URL。Square 的 `THUMBNAIL` 实际为 512×512，但数据中的 `width/height` 仍为 `null`；其它记录已声明尺寸。
- 当前 `COVER` 是 Square/Oval 播放器的点击加载预览，实际尺寸分别为 970×844、974×775。它们服务于现有 Player 比例，不是目录或推荐卡片的 16:9 营销封面。
- 当前 3 条 Game Data 共用 `/og-image.svg`；文件自身为 1200×630，Metadata 也声明 1200×630。IMG-001 不在未审阅新画面时切换 OG URL 或格式。
- GameCard、Recently Played 与 Sidebar 使用 Next Image 并提供显示尺寸；Curated Gallery 已显式 `loading="lazy"`。首页 Player preview 使用真实尺寸、`loading="eager"` 与 `fetchPriority="high"`，并受 PERF-HOME / ASSET-001 的首屏 LCP 契约保护。
- `GameImage` 目前只区分 `THUMBNAIL | COVER | OPEN_GRAPH`，尺寸可空；通用 Player 还会在找不到 `COVER` 时退回数组第一张图。现有 schema 尚不能阻止角色误用、比例错误或声明尺寸与文件事实漂移。

## 2. 确认后的角色规范

为避免把播放器预览误当成 16:9 封面，Game Data 图片角色改为：

| 角色 | 用途 | 尺寸规则 | 加载规则 |
|---|---|---|---|
| `THUMBNAIL` | 游戏卡片、Related、Recent/Favorites | 必须精确 1:1，显式正整数宽高 | 非首屏显式 lazy；不设 priority |
| `LANDSCAPE_COVER` | 未来目录/详情的横向营销封面 | 若存在，必须精确 16:9，显式正整数宽高 | 非首屏显式 lazy；只有经首屏设计确认才可 eager |
| `PLAYER_PREVIEW` | 点击加载前的 Player 预览 | 与 Player 保留比例一致，显式真实宽高；不强制 16:9 | 现有 Square/Oval 首屏保持 eager/high priority |
| `OPEN_GRAPH` | 社交分享元数据 | 必须精确 1200×630，显式宽高 | 不进入页面 lazy/eager 逻辑 |

- 现有 Square/Oval `COVER` 只重命名为 `PLAYER_PREVIEW`，源文件、像素、容器、首屏顺序与网络行为不变。
- 当前记录没有经过权利与视觉确认的 `LANDSCAPE_COVER`，因此不伪造或裁切一张。角色可以缺省；一旦提供就必须通过 16:9 与来源门禁。
- Square `THUMBNAIL` 的声明尺寸修正为已从文件头验证的 512×512；卡片当前回退值本就是 512，因此不改变可见几何。
- 每个公开 Game Record 必须有且仅有一张 `THUMBNAIL` 和一张 `OPEN_GRAPH`；可玩 Player 需要一张 `PLAYER_PREVIEW`，External Tool 不得借此伪装为本站可玩。

## 3. 格式、体积与权利边界

- 新增 `THUMBNAIL` / `LANDSCAPE_COVER` 优先 AVIF 或 WebP；现有 PNG 只作为精确列出的 legacy 资产保留，不因为本任务自动改写。
- OG 先保持当前 1200×630 SVG 与 URL；若后续要换成 PNG/WebP，必须先看一页视觉稿并确认 metadata/社交预览迁移。不得只为追求格式而改变现有 SEO 资源 URL。
- 建议预算作为报告项而不是伪造通用性能结论：Thumbnail 50 KB、Landscape Cover 150 KB、OG 300 KB。超预算先报告并人工判断；比例、尺寸缺失、文件事实不一致属于硬失败。
- 图片必须有与可见用途一致的 `alt`；按钮内纯装饰的 Player preview 继续使用空 alt，由按钮提供可访问名称。
- 只允许 `PROJECT_ASSET` 或经 ASSET-001 清单允许的 `PROJECT_CDN`。不抓取、热链、复制或改造竞品截图，不因文件已存在就推定许可。

## 4. 本地实施范围

用户确认后只实施以下本地、可回滚增量：

1. 新增图片规范/选择 helper，提供按角色取得图片、必需角色 fail closed、角色与页面用途映射。
2. 将当前 `COVER` 迁为 `PLAYER_PREVIEW`，新增可选 `LANDSCAPE_COVER`，把 Game Data 图片宽高改为必填正整数；移除组件中的 512/1200×675 猜测回退。
3. 新增 `npm run images:check`：读取实际 PNG/WebP/SVG 文件尺寸与 MIME/扩展名，核对 Game Data、ASSET manifest、角色比例、唯一性、alt、允许来源与 legacy 格式白名单。
4. 增加负例，确保缺尺寸、伪尺寸、非 1:1 thumbnail、非 16:9 landscape、非 1200×630 OG、错误角色、外站/竞品路径、重复角色、非法格式和错误 lazy/eager 策略均失败。
5. GameCard、Recently Played、Sidebar 与 Curated Gallery 的非首屏图片明确 lazy；Player preview 保持 eager/high priority。Metadata 继续只读取 `OPEN_GRAPH`。
6. 不增加图片处理依赖，不生成、裁切、转码、替换或删除二进制；不改 URL、Title、description、H1、canonical、schema、robots/index、sitemap、可见文案或版式。

## 5. 验证与验收

- 专项：`images:check` 正例与负例；校验 29 个 public 图片的实际尺寸，并证明 Game Data 角色选择不再回退猜测。
- 回归：`assets:check`、`games:check`、`player:check`、`components:check`、`metadata:check`、`perf-home:check`、Square/Oval/Pixel、目录/分类/Related/Recent/Favorites。
- 工程：TypeScript、0-warning lint、Next build、OpenNext build；不刷新旧 golden 来隐藏失败。
- 渲染：1280×900、390×844、360×800 检查首页、Oval、Pixel、`/games`，核对图片尺寸、无横向溢出、首屏 Player preview 与 Play 行为；能取得时记录 console 与图片请求。
- SEO：确认 URL、metadata、H1、canonical、robots/index、sitemap 与 OG URL 未漂移；`seo:prod` 只在另获部署授权后运行。
- 完成实施后只把 `IMG-001` 标为 `待验收`；等待用户验收，不自动开始 `CWV-001`。

## 6. 回滚与停止点

- 回滚只逆向 IMG-001 的角色/helper/checker/组件属性与 Square 尺寸声明，不覆盖其它未提交成果。
- 现有 Square/Oval Player preview、OG、curated examples 与所有图片二进制不变，因此本地方案阶段没有线上回滚事项。
- 当前只完成盘点与方案。没有修改应用、图片、依赖、R2 或生产；只有收到 `确认 IMG-001 图片规范与优化管线方案，进行开发` 后才进入编码。
