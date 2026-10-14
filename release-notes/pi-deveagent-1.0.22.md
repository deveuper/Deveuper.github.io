Pi DeveAgent 1.0.22 修复模型选择、异步会话归属和插件工具恢复。

- 模型选择器与会话创建使用同一份 Pi 能力目录；保留扩展注册模型、思考配置和冷启动回退。
- 克隆或切换会话时拒绝旧进程的迟到回执，防止刷新替换进程的状态与历史。
- Plan 退出和重复进入时保留晚到工具，同时维持计划期间的只读限制；不会自动启用原先停用的 edit/write。
- MoA 运行状态使用共享旋转样式。Windows 自动化验收的 home 与临时配置目录保持隔离。

此前的左栏宽度修复和终端按需加载继续保留。工作台与独立官方 Pi 1.0.3 分别维护；本版未更换内核。

验证：最终全量回归 7,422 项通过、6 项跳过、0 失败；其中相关回归 422/422。类型检查和构建通过。真实 Pi/preload 的扩展模型创建链路通过，未发送 prompt、生成尝试为 0。候选与安装后各 3 项隐藏 Electron 侧栏回归通过。安装器实际解压到中文目录，41,732 文件逐个核对。

分发包不复制个人模型、账号和桌面配置；当前及历史已知个人凭据扫描结果为零。官方 Pi 的 15,052 个运行时文件与上一版一致，本地 55 项保护记录核验通过。请选择空目录解压；已有文件或配置的目录会拒绝覆盖。

本轮没有收费模型生成。复杂国产编码、长期不限轮次 MoA、所有商业网关及固定 40% Token 节省仍未验收。

English: Aligns model creation with the capability catalog, rejects stale clone/switch replies, preserves late tools across Plan transitions, and unifies MoA loading feedback. The independent Pi core and personal configuration are preserved. No paid model generation was performed.

Windows x64 · MIT（第三方协议随包保留）

文件：`Pi-DeveAgent-1.0.22-win-x64-Setup.exe`

大小：395226802 bytes

SHA256：`9c85d433dac5dcf161652de3159092ac92d0afb91e4a8c2a1556199f86fbcc5a`

同名 `.sha256` 校验文件随包提供。
