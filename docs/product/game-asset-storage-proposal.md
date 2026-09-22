# ASSET-001 · 游戏资源与应用代码分离方案

> 2026-09-08 · 看板 v1.96 · **方案已确认，本地实现已获用户验收**  
> 当前任务：`ASSET-001`  
> 依赖：`GAME-DATA-001` 已本地验收  
> 用户确认：`确认 ASSET-001 方案，进行开发`  
> 用户验收：`ASSET-001 验收通过`

## 1. 当前事实

- `public/` 当前有 40 个文件、29,367,157 bytes（28.01 MiB，包含说明文件）。其中固定版 Ruffle 的 5 个运行文件占 27,512,697 bytes（93.69%），Square/Oval 两份 SWF 占 1,403,193 bytes（4.78%），其它图片、图标、说明与文本合计 451,267 bytes。
- 当前 OpenNext 静态产物约 28.90 MiB；新增本地游戏包会继续进入应用静态产物。删除当前工作树中的文件不会自动缩小已有 Git 历史，本任务的目标是阻止未来持续增长并建立可验证的资源发布方式。
- `GameRecord.images[].src` 已允许 HTTPS URL，并已有 `PROJECT_CDN` provenance；但 `RUFFLE_SWF.swfSources`、HTML5 与 Local iframe 当前被播放器模型限制为本地根路径，`source` 也只有 `LOCAL_PROJECT_ASSET` 与 `OFFICIAL_EXTERNAL_PAGE`。
- Cloudflare 账户已有名为 `mysquarefaceicon` 的 R2 桶，区域为 APAC，当前 2 个对象、约 76.9 kB；`static.mysquarefaceicon.com` 已作为 active custom domain 连接。它与评论图片的 `mysquarefaceicon-comment-images` / preview 桶是不同生命周期，不能混用。
- 现有 `https://static.mysquarefaceicon.com/squarefacegenerator/square-face-cover.png` 返回 200、`image/png`、76,781 bytes；SHA-256 `15a5c93f79859441eef3032ce45e07abc2e91a7520a9aaef42158dd4fe00a535`，与本地 `public/games/square-face-cover.png` 一致。当前响应为 `Cache-Control: max-age=14400`，没有 CORS 响应头。
- 历史本地 Lighthouse 记录中，上述远端 Square cover 曾是移动 LCP 元素且下载时间较长；当前 `PERF-HOME-001` 使用字节锁定的本地首屏 cover。ASSET-001 不把首屏 LCP 资源迁回远端来换取很小的仓库收益。
- Square/Oval SWF 的来源和再分发权仍为 `UNKNOWN`；License Registry 明确写着“不得把 SWF 移到新主机”。Pixel 是 `DIRECT_LINK_ONLY`，禁止复制、镜像、代理或热链原站资产。
- Ruffle 是已验收的应用运行时而不是游戏内容包。它继续由精确 npm 版本、同源 `/ruffle/`、5 文件 manifest/hash 和独立升级回归治理；本任务不把 Ruffle 迁到 R2，也不改变已验收的 `RUFFLE-001` 契约。

Cloudflare 当前文档说明：R2 的 `r2.dev` 地址只适合非生产测试；生产应连接自有 custom domain，custom domain 才能使用 Cloudflare Cache、WAF 与访问控制。[Public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/) / [R2 cache](https://developers.cloudflare.com/cache/interaction-cloudflare-products/r2/)。浏览器跨域读取 R2 对象必须配置 CORS；custom domain 会对有效跨域请求返回相应 CORS 头，更新策略后还需清除旧缓存。[Configure CORS](https://developers.cloudflare.com/r2/buckets/cors/)。

## 2. 确认后的本地实现

### 2.1 单一资产清单

新增 `data/game-asset-manifest.json`，每项只记录资源事实，不保存二进制：

```text
assetId / gameId / kind
delivery (APP_STATIC | R2_CUSTOM_DOMAIN | OFFICIAL_EXTERNAL)
url / objectKey
bytes / sha256 / contentType / cacheControl
licenseRegistryRecordId / rightsGate
migrationStatus / sourcePath（仅迁移期）
```

- `kind` 至少覆盖 `SWF`、`HTML5_BUNDLE`、`IMAGE`、`AUDIO`；Ruffle 使用独立 manifest，不重复进入游戏资产清单。
- R2 对象 URL 只允许 `https://static.mysquarefaceicon.com/`；拒绝 `r2.dev`、未知 CDN、HTTP、查询串版本和无 hash 的长期缓存 URL。
- Game Data 只消费公开 URL与显示/运行元数据；R2 bucket、凭据、上传命令和内部部署状态不进入浏览器数据。
- 当前本地资产也进入 manifest，以 `APP_STATIC` 明确记录，而不是假装已经迁移。

### 2.2 路径与缓存约定

R2 object key 使用不可变、可并存、可回滚的内容寻址结构：

```text
games/{game-id}/{kind}/{sha256-prefix}/{filename}
games/{game-id}/html5/{release-id}/{relative-path}
```

- hash 资源：`public, max-age=31536000, immutable`。
- 可变 manifest/指针（若以后确有需要）：`public, max-age=0, must-revalidate`，不得与二进制共用不可变 URL。
- 上传时必须写入精确 `Content-Type`、`Cache-Control`、字节数和 SHA-256；同一个 object key 不得覆盖为不同内容。
- SWF 使用 `application/x-shockwave-flash`；WASM 使用 `application/wasm`；HTML5 bundle 保持完整相对路径树，不拆散后猜测依赖。

### 2.3 Fail-closed 检查器

新增 `npm run assets:check`，在未来 build/cf:build 接入前先以独立命令验收：

- 校验 asset ID、game ID、URL/object key、文件扩展名、MIME、字节数、SHA-256、缓存策略与唯一性。
- 校验 Game Data 引用都能映射到 manifest；`PROJECT_CDN` 必须使用允许的 custom domain，`APP_STATIC` 必须存在本地文件并匹配 hash。
- `UNKNOWN`、`REVIEW_REQUIRED`、`DIRECT_LINK_ONLY` 或明确禁止再分发的记录不能变成新的 R2 对象；负例必须非零退出。
- Ruffle runtime、评论图片桶、外站 Pixel 资源和无来源文件不得被游戏资产同步逻辑接管。
- 本地 checker 不上传、不删除、不改 R2，也不因为 URL 可访问就把权利写成允许。

## 3. 外部存储与迁移阶段

本任务确认后先完成上述本地 convention/manifest/checker；以下外部状态变更仍需单独明确授权：

1. 在现有 `mysquarefaceicon` 公共资产桶使用现有 `static.mysquarefaceicon.com`，不创建第二个游戏资产桶，也不复用 `COMMENT_IMAGES_R2`。
2. 配置只读 CORS：生产仅允许 `https://mysquarefaceicon.com` 的 `GET`/`HEAD`；本地测试使用明确的 localhost origin，不能开放浏览器 `PUT`/`DELETE`。
3. 将 custom domain 最低 TLS 从当前 1.0 调整为至少 1.2；禁用任何生产 `r2.dev` 入口。
4. 只上传 `rightsGate=ALLOWED` 且 hash 已锁定的对象，上传后执行 HEAD/GET、MIME、Cache-Control、CORS、字节数与 SHA-256 检查。
5. Game Data 先切一个非首屏、非关键、权利清晰的样例；保留本地旧资源一个发布周期作为回滚，不在同一变更中删除。
6. 浏览器通过 Play 前零游戏包请求、Play 后只请求预期对象、Reload/错误/回滚和移动端后，才能删除工作树中的已迁移副本；生产验证前不改 sitemap/index/metadata。

Cloudflare R2 支持为对象保存 `contentType` 与 `cacheControl` HTTP metadata；本方案把它们与 hash 一起设为上传后检查项。[R2 API object metadata](https://developers.cloudflare.com/api/resources/r2/)。

## 4. 当前资产迁移判定

| 资产 | 当前决定 | 原因 |
|---|---|---|
| `public/ruffle/*` | `EXCLUDED_RUNTIME` | 已由 RUFFLE-001 精确版本与同源路径治理；不是游戏内容资产 |
| Square/Oval SWF | `BLOCKED_RIGHTS_UNKNOWN` | Registry 禁止在 UNKNOWN 时移动到新主机；不上传、不删本地副本 |
| Pixel 原站资源 | `EXTERNAL_DIRECT_ONLY` | 禁止复制、镜像、代理与热链 |
| Square 首屏 cover | `KEEP_APP_STATIC_LCP` | 当前本地版本受 PERF-HOME 保护；远端历史 LCP 风险大于约 75 kB 仓库收益 |
| Oval cover/icon 与当前小图 | `HOLD_CURRENT` | 总量小；等待 IMG-001 的尺寸/格式/权利管线后再决定 |
| 未来权利清晰的大型 SWF/HTML5/audio | `R2_CANDIDATE` | 先通过 License/manifest/hash，再上传内容寻址 URL |

因此，ASSET-001 可以完成可扩展架构与 fail-closed 管线，但当前不会制造一份新的 Square/Oval SWF 副本。材料请求任务继续保持取消，不重新索取材料，也不把不能迁移写成已迁移。

## 5. 布局、SEO 与交互冻结

- 不新增页面，不改 URL、Title、description、H1、canonical、schema、robots/index、sitemap、关键词、内链或可见文案。
- `/` 与 `/oval-face-icon-generator` 继续从当前本地 SWF 启动，首屏 cover、Player 比例、Play/Reload/Fullscreen/Report 和 click-to-load 行为不变。
- `/pixel-art-avatar-icon-generator` 继续仅打开原站，不增加本地或 R2 资源。
- ASSET-001 本地阶段只增加 schema/manifest/checker/文档与负例；没有经过单独迁移授权时，生产网络请求应与当前完全一致。

## 6. 实施后验证矩阵

1. `assets:check` 正例，以及未知 host、HTTP、`r2.dev`、重复 key、hash/MIME/cache 漂移、无 manifest 引用、UNKNOWN 权利上传、Pixel 复制等负例全部 fail closed。
2. `games:check`、`player:check`、`ruffle:check`、Square/Oval/Pixel 与 PERF-HOME 冻结回归通过。
3. TypeScript、lint、Next build 与 OpenNext build 通过；静态产物清单和体积变化明确记录。
4. 本地浏览器验证首页/Oval/Pixel 的初始请求、Play/Reload、错误态和三视口；本地阶段应无新增 R2 游戏请求。
5. 只有另获外部迁移授权后，才验证 custom-domain HEAD/GET、MIME、缓存、CORS、TLS、hash、Range、回滚与生产浏览器。
6. 本任务不改 SEO；本地 SEO/robots 回归用于确认 20 URL、0 mandatory 和既有 should 提醒没有漂移，`seo:prod` 仍只在授权部署后运行。

## 7. 回滚

- 本地架构回滚：移除 ASSET-001 新增 manifest/checker/schema 增量，恢复原 package scripts；不触碰已验收的 Ruffle、Game Data、SWF 或页面成果。
- 单资产迁移回滚：Game Data 恢复上一条已验证 URL；旧本地副本在生产验收前保留。hash URL 不覆盖、不删除，避免缓存把新旧内容混淆。
- Cloudflare 回滚：恢复上一版 CORS/cache/TLS 配置并清除受影响 hostname 缓存；评论图片桶完全不参与。
- 没有部署时无生产回滚事项；不得用 `git reset --hard` 覆盖工作区其它未提交成果。

## 8. 当前停止点

用户确认后，本轮已完成本地 manifest、类型/结构约束、fail-closed checker、20 个负例和现有 Game Data 资产映射；清单当前只声明 `APP_STATIC`，没有把任何资源写成已迁移。Square/Oval SWF 继续因权利 `UNKNOWN` 阻止迁移，Pixel 继续仅直链，Ruffle 继续由独立运行时清单治理，Square 首屏 cover 保持本地。

没有创建或修改 R2 bucket、domain、CORS、TLS、对象或绑定；没有上传/删除资产，没有切换 Game Data URL，没有修改 Ruffle/SWF、页面、SEO 或依赖版本。用户已明确回复 `ASSET-001 验收通过`，因此本地任务可标记完成；该验收不授权外部 R2 变更、提交、推送或部署，也不关闭权利与生产门禁。下一项 IMG-001 另行遵守方案确认门禁。
