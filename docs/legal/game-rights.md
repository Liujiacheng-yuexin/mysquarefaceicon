# LEGAL-001 · Game Rights and License Registry

> 审查日期：2026-08-31（Asia/Shanghai）<br>
> 适用范围：当前 Square、Oval、Pixel external 三类内容<br>
> 结构化事实源：data/game-license-registry.json<br>
> 边界：这是项目证据登记和发布门禁，不构成法律意见；没有证据的权限统一写 UNKNOWN。

## 1. 结论

| 对象 | 当前交付方式 | 来源/作者 | 许可状态 | 当前门禁 |
|---|---|---|---|---|
| Square Face Generator | 本地 SWF + Ruffle | 精确二进制来源、作者和权利人均未被证据绑定 | UNKNOWN | 现状待复核；禁止扩展复制、迁移托管、商业授权声明 |
| Oval Face Icon Generator | 本地 SWF + Ruffle | 只有仓库文件、git 记录和历史 SEO 日志中的“authorized”说法 | UNKNOWN | 现状待复核；禁止扩展复制、迁移托管、商业授权声明 |
| Pixel Art Avatar Icon Generator | 只链接到官方外部页面 | IconGenerators / Eichi Zerona，官方页面可核验 | RESTRICTED | 只允许直接链接；禁止 iframe、镜像、代理、热链或复制资源 |

UNKNOWN 不等于允许。现有 Square/Oval 页面已经在线，但 LEGAL-001 没有取得能证明继续托管、公开运行、广告场景使用或再分发的书面文件，因此不能把“项目文档写过 authorized”升级为已验证授权。

## 2. 审查方法

- 对两个本地 SWF 仅核对路径、大小、SHA-256、git 引入记录，以及当前或历史项目文案中的权利说法。
- 没有反编译、反汇编、提取资源、修改或重新打包 SWF。
- 搜索项目仓库和 Liu-library 的相关工作跟进/模板目录，没有找到可绑定到确切 SWF 哈希的许可文件、邮件、合同、原始下载页或授权截图。
- 对 Pixel external 只读取官方公开页面、官方条款和响应头，没有复制其生成器或资源。
- 第三方 preservation 站、竞争站自称 original/authorized、文件能下载或网页能打开，都不作为授权证据。

## 3. Square Face Generator

### 已确认事实

- 本地文件：public/games/square-face.swf
- SHA-256：B1D074C95F15B7DCECDBC2405ABF820EAD985669BB12CD47247FC8EA7537BC1E
- git 首次引入：64b10474a21051b9e4e55eb31c3530567d639d43，2026-05-13，提交说明 Initial mysquarefaceicon site
- 当前公开 URL：https://mysquarefaceicon.com/
- 当前 Terms、About 和 locale 文案仍使用“provided/authorized”表述；历史 SEO_LOG 也有同类记录，但仓库内没有对应原始授权材料。PROJECT_BRIEF.md 与 public/games/README.md 已迁移为 UNKNOWN 口径。

### 作者候选不等于确权

IconGenerators 当前官方 [Square Face Icon Generator](https://www.icongenerators.net/square.html) 页面将作者标为 Eichi Zerona / えいちぜろな（@h071019）。但当前仓库没有证据证明本地 SWF 哈希就是该页面的特定历史文件，也没有证明作者或权利人允许本站托管和公开运行该二进制。因此：

- exact binary source：UNKNOWN
- author / rights holder for exact binary：UNKNOWN
- license：UNKNOWN
- commercial use：UNKNOWN
- public embed/performance：UNKNOWN
- attribution：UNKNOWN
- modification：UNKNOWN
- redistribution：UNKNOWN

IconGenerators 当前[官方条款](https://www.icongenerators.net/terms.html)还明确禁止未经书面许可复制、再发布、嵌入、frame、镜像、代理和热链站点资源。这只是风险信号，不能反向证明本地 SWF 的来源或历史许可。

### 需要补充的证据

1. 该 SHA-256 文件的原始来源 URL 或交付记录。
2. 权利人/有权许可方姓名与联系方式。
3. 书面授权、许可证或可存档官方条款。
4. 授权是否覆盖本站托管、Ruffle 公开运行、广告/商业场景、备份/CDN/R2、修改、署名和再分发。
5. 游戏生成图片的个人/商业用途范围。

## 4. Oval Face Icon Generator

### 已确认事实

- 本地文件：public/games/oval-face.swf
- SHA-256：80E974D8EF4AD5E849E93464EAEA1833620C269BAC30601D960F5438C285E09B
- git 首次引入：daeb291088cb65bf6860fdc24766919563fb7217，2026-05-26，提交说明 oval face 更新
- 当前公开 URL：https://mysquarefaceicon.com/oval-face-icon-generator
- 历史 SEO_LOG 曾称其为 authorized；当前 SEO_PLAN 与 public/games/README.md 已迁移为 UNKNOWN。没有原始来源 URL、作者、权利人、许可名称或书面证据。

当前所有权利字段保持：

- source URL：UNKNOWN
- author / developer：UNKNOWN
- rights holder：UNKNOWN
- license：UNKNOWN
- commercial use：UNKNOWN
- public embed/performance：UNKNOWN
- attribution：UNKNOWN
- modification：UNKNOWN
- redistribution：UNKNOWN

Oval 没有从 Square 的作者候选或当前官方条款继承任何许可结论。两个文件必须分别提供证据。

## 5. Pixel Art Avatar Icon Generator

### 可核验证据

- 官方工具：[Pixel Art Avatar Icon Generator](https://www.icongenerators.net/pixelavatar.html)
- 官方条款：[IconGenerators Terms of Use](https://www.icongenerators.net/terms.html)
- 官方页面标注作者：Eichi Zerona / えいちぜろな（@h071019）。
- 官方条款明确允许链接到单个生成器页面。
- 2026-08-31 的 HEAD 检查：页面返回 200，同时发送 X-Frame-Options: SAMEORIGIN 与 Content-Security-Policy: frame-ancestors 'self'。

### 权限结论

| 字段 | 结论 | 说明 |
|---|---|---|
| source | VERIFIED | 官方 URL 可访问 |
| author | VERIFIED | 官方页面署名 |
| license | RESTRICTED | 自定义条款，不是 MIT/CC 等开放许可证 |
| commercial use | RESTRICTED | 生成图片可用于个人线上活动；企业/营利组织制作品及通过图片获利被禁止 |
| embed | NO | 条款禁止，响应头也阻止第三方 frame |
| direct link | YES | 条款明确允许链接到单个生成器页面 |
| attribution | CONDITIONAL | 普通个人线上使用为鼓励；条款所列个人非商业印刷/视频/游戏用途要求注明来源并链接 |
| modification | YES_GENERATED_IMAGES_ONLY | 可修改生成图片，不代表可修改生成器、脚本、数据或素材 |
| redistribution | NO | 未经书面许可不得复制、再发布、热链或系统下载站点资源 |

当前项目页面只做来源清晰的直接出站链接，符合本次读取到的 direct-link 边界。后续不得重新加入 iframe、代理或本地复制，也不得把 Pixel 生成图片描述为商业可用。

## 6. 当前公开文案风险

以下用户可见代码仍含有未由 Registry 证实的 authorized 或相近权利表述：

- app/terms-of-service/page.tsx
- lib/locales.ts
- app/about-us/page.tsx 中的 provided for this project 表述
- 部分页面中的 original 表述；其中一些只是描述原有交互，仍需逐条区分是否暗示权利或来源

LEGAL-001 已同步修正 PROJECT_BRIEF、SEO_PLAN 和 public/games/README 的内部授权口径，但没有改动生产页面、Terms、播放器或 SWF。原因是移除/改写公开权利声明会影响用户可见内容，应作为明确的内容修复任务接受验收，不能在 Registry 任务中悄悄扩大范围。

在修复前，团队不得在新页面、schema、广告申请、合作材料或发布说明中继续复制这些未证实措辞。

## 7. 发布与扩展门禁

### 本地二进制

只有同时满足以下条件，才能把游戏状态从 UNKNOWN 改成 VERIFIED：

1. 证据能识别 exact file/hash 或明确覆盖该版本。
2. 提供方是权利人或有权许可方。
3. 授权覆盖实际交付方式：本站托管 + 浏览器公开运行。
4. 单独记录商业/广告、嵌入、署名、修改、CDN/备份和再分发范围。
5. 证据 URL、文件/截图路径、审查日期可复核。

### External Tool

- 默认 DIRECT_LINK_ONLY。
- 只有官方条款明确允许且浏览器安全头允许时，才考虑 iframe。
- “能 iframe”仍不等于有许可；条款与技术条件必须同时满足。
- 禁止绕过 X-Frame-Options、CSP、登录、地域或访问控制。

### 默认自动门禁

    license.status == UNKNOWN      -> 新游戏不得 publish
    commercialUse == UNKNOWN       -> 不得声明商业可用或进入商业扩展
    assetRedistribution == UNKNOWN -> 不得复制、迁移或打包资源
    external embedAllowed != YES   -> 只能 direct link

## 8. LEGAL-001 验收映射

- [x] Square 来源、作者/权利人、许可、商业、嵌入、署名、修改和证据状态已登记。
- [x] Oval 同字段已登记，未从 Square 推断。
- [x] Pixel external 的官方来源、作者、限制、direct-link 和 no-embed 边界已登记。
- [x] 无法确认的字段全部保持 UNKNOWN。
- [x] Registry 明确 UNKNOWN != allowed。
- [x] 两个 SWF 未被反编译、修改或重新分发。
- [x] 没有改生产页面、URL、index 状态或部署配置。

## 9. 回滚

本任务只新增 data/game-license-registry.json 与本文件，并更新治理日志/看板。退回时可以删除这两个新增文件并撤销相应日志与看板记录；不得因此恢复旧版 3%-5% SEO 口径，也不得删除已经通过用户验收的 AUDIT/BASE 证据。
