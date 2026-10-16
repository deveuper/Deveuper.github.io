Pi DeveAgent 1.0.23 改善滚动跟随、历史恢复和工具状态，并补齐新版 Kimi 模型目录识别。

- **滚动跟随：** 只回传仍与实时引擎一致的状态，避免过期快照覆盖手动浏览或返回底部的操作。
- **历史恢复：** 首次绑定使后台读取失效时，丢弃旧结果并重新读盘一次。重读保留完整归属检查，真正替换后的迟到结果仍被拒绝。
- **工具详情：** 无输出的长任务显示运行中，结束后再显示完成或失败；中文、英文及历史终态同步处理。
- **模型目录：** 识别新版 Kimi 接口声明的上下文容量、图片输入与精确思考档位。可选思考的模型保留关闭选项，必须思考的模型不错误开放关闭选项；沿用官方 Pi 的原生行为。未声明或无效能力保持未知，既有明确配置优先，不改变用户默认档位。

工作台与独立官方 Pi 1.0.3 分别维护。此前的左栏宽度稳定和终端按需加载继续保留，属于既有能力。

最终完整全量回归 7,452 项通过、6 项跳过、0 失败，进程自然退出；组合相关回归 326/326，与全量重叠，不相加。类型检查与构建通过。源码、候选包和安装后窗口各 4 项验证通过，包含实际侧栏拖动、缩放与滚动交互。Kimi 目录采用离线组件测试和官方 Pi 纯函数对照，未连接真实目录端点，本轮没有收费模型生成。

分发目录 41,732 文件的当前及历史已知个人凭据扫描结果为零；默认账号、模型配置和桌面个人配置未进入分发内容。ZIP 与安装器实际解压后逐文件校验一致，重复及已有配置目录会拒绝覆盖。解压后的原生入口和本地安装入口均完成隐藏启动、正常退出验证。官方 Pi 的 15,052 个运行时文件未变，本地更新后 55 项配置与会话保护记录未变，保留旧版回退。

复杂国产编码、长期不限轮次 MoA、全部商业网关和固定 40% Token 节省仍未验收。旧版真实 API、媒体、终端和 MoA 结果不记作本版验收。

English: Keeps scroll-follow feedback current, retries initial history from a fresh read after first binding, shows actual running/completed/failed tool status, and reads explicitly declared capabilities from the updated Kimi model catalog. The independent Pi core is maintained separately. No paid model generation was performed in this round.

Windows x64 · MIT（第三方协议随包保留）

文件：`Pi-DeveAgent-1.0.23-win-x64-Setup.exe`

大小：395238472 bytes

SHA256：`a820650ac8f84ca3687e236e5a0400cdb7828ff34d702baf50e2fe0473433b21`

同名 `.sha256` 校验文件随包提供。请选择空目录解压，并保留原有设置与会话。
