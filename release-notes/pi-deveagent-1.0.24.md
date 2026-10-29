Pi DeveAgent 1.0.24 完善会话稳定性、计划恢复、内容显示和设置加载。

### 一、会话排序与命令归属保持一致

- 旧扫描不再回退已提交的改名或活动时间；返回记录、排序和持久化统一使用较新时间，真实后续活动仍可推进。
- 命令目录 RPC 返回后验证原运行实例归属，拒绝进程、会话或代际替换后的旧命令，同时保留合法空目录。

### 二、计划恢复只续接已确认执行

- 会话恢复时仅保留明确确认执行的计划及其进度；未确认草案待办清空，空记录会话不残留上一会话变量。
- 已有残留仅追加一次清理记录；恢复不自动发送执行消息，原有计划工具权限与执行确认保持生效。

### 三、Markdown 清理危险 HTML 与全局样式

- 会话 Markdown 与文件差异预览复用安全清理链，阻止内容中的 style、script、iframe、form 等节点影响工作台。
- 保留数学公式、允许的 SVG 与本地文件链接，不添加新的解析依赖。

### 四、设置加载提供反馈并支持取消

- 首次设置模块慢加载时显示等待面板，可用 Esc 或关闭按钮取消，不再只有空白等待。
- 取消后迟到的模块结果不会重新打开设置；正常交接保留焦点约定，不强行抢回输入焦点。

工作台与独立官方 Pi 1.0.3 分别维护，本地已更新为 1.0.24。

最终完整回归 7,481 项通过、6 项跳过、0 失败；相关组合 204/204，两者有重叠，不相加。类型检查与 main/preload/renderer 构建通过。源码、候选包和安装后窗口各 4/4，覆盖侧栏宽度、125% 缩放下拖动与时间线滚动；不扩大为全部 UI 验收。

分发包 41,732 个文件的当前及历史已知个人凭据扫描为零，默认账号、模型和桌面个人配置未进入包内。ZIP 解压逐文件校验一致；安装器实测中文路径完整解压，重复及已有配置目录拒绝覆盖。独立官方 Pi 1.0.3 的 15,052 个运行时文件与上一版一致，本地 55 项保护记录通过。保留 1.0.23 回退。

本轮没有收费模型生成。复杂国产编码、长期不限轮次 MoA、全部商业网关和固定 40% Token 节省仍未验收。旧版真实 API、媒体、终端和 MoA 结果不记作本版验收。

English: Preserves newer session activity and command ownership, restores only approved plan execution, sanitizes Markdown previews, and adds cancellable settings loading feedback. The independent Pi core and personal configuration are preserved. No paid model generation was performed.

Windows x64 · MIT（第三方协议随包保留）

文件：`Pi-DeveAgent-1.0.24-win-x64-Setup.exe`

大小：395228188 bytes

SHA256：`9060c27c851864420d11e173b928aefac90bca58edd7c5c073ac9c515fee27a3`

同名 `.sha256` 文件提供校验。请选择空目录完整解压，保留原有设置与会话。
