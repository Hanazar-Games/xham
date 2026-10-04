# v0.122.1 QA

- `npm test`：12个测试文件、3504个用例通过，覆盖题库数量、题目唯一性、图片存在、来源、练习卷数量、音频生命周期与游戏引擎。
- `npm run build`：TypeScript 与 Vite 生产构建通过；保留既有 chunk 体积提示。
- `npx playwright test tests/audio.e2e.ts`：6个音频浏览器回归通过，覆盖移动声音设置、延迟试听取消、BGM/SFX 独立总线、暂停、静音和页面可见性恢复。
- 本轮重点检查 UI/UX/SFX/BGM：声音开关、音量反馈、状态提示、题库索引和新增批次集成。
