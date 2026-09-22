# CONTENT-QA-001 · 游戏内容事实核验标准

> v1.71 · 2026-09-03 用户明确回复“CONTENT-QA-001 验收通过”，已登记第 30 条源验收。仅验收标准与模板，原 [checks.json](checks.json) 不改写；新增 [验收记录](acceptance-checks.json)。
> 用户同时要求下一项，当前只准备 [GAMES-INDEX-001 目录方案](../../../product/games-index-directory-proposal.md)，确认前不编码或部署。以下为 v1.70 原始交付记录，其中“当前/待验收/不启动 Week 5”仅指当时，不撤销本次明确验收。

用户当前指令：2026-09-03「继续进行开发」。本轮只执行看板 Week 4 的 CONTENT-QA-001，不恢复已取消的 LICENSE-GATE 材料任务，不部署、不启动 Week 5。

## 交付物与范围

- [游戏页面独特内容与事实 QA 标准](../../../content/game-page-quality-standard.md)：独立价值、14 组实际字段映射、逐条证据、FAQ、移动/操作边界、AI 人类复核、SEO/发布分离。
- [单页审核记录模板](../../../content/game-page-review-template.md)：可复制到获准任务的证据目录，默认未验证/未完成人类审核，不形成第二任务看板。
- CONTENT_PLAN 增加技能必读的执行入口；PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG 与权威看板同步本轮范围。
- 不新增运行时校验器或自动发布功能；标准与流程需要实际执行，不能据此声称网站所有内容已经合格。

当前任务仅交付标准与模板，状态 `待验收`；请验收规则是否明确、模板是否可直接使用、未知项与外部工具边界是否保留。用户验收口令：`CONTENT-QA-001 验收通过`。这不代表审核模板中的未来页面已获验收。

## 验证记录

本轮详细环境、日期、文档/链接/字段检查、看板离线 VM、冻结哈希和命令退出码见 [checks.json](checks.json)。文档与看板逻辑验证、实际页面验证、历史 QA、用户验收及生产发布分别记账。

原应用/检查/配置 154 项、历史 JSON 25 份、截图文件路径 173 个（含副本，不是 173 个独立视觉场景）、构建产物 18 个、Registry/两份 SWF 与 29 条源验收均以本轮开始时的只读哈希快照为对照。归档的 3 份取消文件保持原位置与字节；不重新创建其活跃文件。

没有修改用户网站 URL、页面、metadata、索引、布局、运行数据或依赖，所以本轮不重跑应用 type/lint/tests、Next/OpenNext 构建、HTTP/seo:check、应用 Browser/移动或 CWV。它们均为本轮未验证/未执行，不把 v1.67 的 42 项历史命令重新记为当前通过，也不声称旧本地预览仍在线。

看板仅做静态文本/JS 和离线 VM 测试；真实文件浏览器视觉仍受此前访问限制，未绕行，未验证。VM 是测试内存，不读取或更改用户实际浏览器 localStorage。

## 规则与一手依据

沿用 IA-02、CT-01～08、KW-01～07/10～16、TR-06/07/10、META-06/09、AY-03/06、PS-03～08、OP-05/09/10/12；本项不扩充或重写 RULES 的优先级、评分算法、词数/语义覆盖口径。

2026-09-03 只读查阅 Google Search Central 的 [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)、[spam policies](https://developers.google.com/search/docs/essentials/spam-policies) 与 [structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)，用于核对独有价值、无固定偏好字数、规模化内容与可见 schema 的原则；不是三页的 KW-04 SERP 前十调查。

## 保留风险与停止点

- LICENSE-GATE 材料任务保持取消；UNKNOWN 不改写，不发起新的材料请求。此次标准交付不验证真实许可或生产发布。
- Oval 完整模板迁移仍延期，本地绑定验收保持；旧窄屏首屏入口问题、About/Editorial 窄卡及 Gallery 间距没有修复。
- 12 条历史 SEO should、KW-04、外站实际编辑/保存/真机行为、完整 SWF 控制与全屏、CWV、生产版本/一跳/robots/SEO/广告/CMP 仍不因本项关闭。
- 本轮未提交、推送、部署、执行 seo:prod 或开始 GAMES-INDEX-001；整体发布不通过/未部署的旧风险没有被标准或局部通过抵消。

## 回滚

仅逆向本轮 4 份现有项目文档与看板的限定增量，移除本项新标准、模板和证据目录前先核对当前哈希与后续是否引用它们。不要覆盖整份脏文件，不改共享规则、已有游戏数据、历史 QA 或源验收；不恢复取消的材料待办。本轮没有线上变更，无线上回滚操作。
