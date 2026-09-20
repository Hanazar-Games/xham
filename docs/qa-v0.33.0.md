# v0.33.0 检查记录

日期：2026-09-20。

- 新增《龙与虎》50题：简单18、中等17、困难15；每题有本地原创配图、解析及东京电视台来源。三套12题练习与14道考试专属题。全站1522题、93套练习；目录27／200条目、1350／10,000题。
- 先添加范围、25集覆盖、关键关系及来源页分组测试，确认尚未接入时失败，再实施题库接入。
- `npm test`：315／315通过，覆盖所有题库的数据、唯一性、难度、选项、配图和来源校验。
- `npm run build`：通过。主JS840.51 kB（gzip 305.13 kB），仍有超过500 kB的体积警告，未修改阈值。
- `npx playwright test tests/catalog.e2e.ts tests/anime-center.e2e.ts tests/loading.e2e.ts tests/images.e2e.ts`：30／30通过，覆盖目录进度与作品入口、各专区、加载、图片失败恢复。
- `npx playwright test tests/quiz.e2e.ts tests/exams.e2e.ts -g 'toradora|layout and dialogs'`：11／11通过，覆盖新50题考试的全部图片与评分、三套练习的逐题图片及复习重玩、七种屏幕尺寸的布局与公告。此轮为针对题库改动的41项浏览器回归，未重跑全部旧作品流程或音频专项。
- `npm run test:deployment`：通过，核查 `/xham/` 路径入口、封面、题目、署名与返回。
- dev-browser检查390px手机困难题截图：题干、图片与长选项正常显示。没有新增外部图片请求，使用已有原创图，图片有复用。
- v0.32.0公告原文归档，更早历史保持不变；依赖锁文件仅变更根项目版本。

题目范围与事实边界见[来源记录](quiz-expansion/sources-toradora.md)。下一条目为 #27《Mob Psycho 100》，10000题目标尚未完成。
