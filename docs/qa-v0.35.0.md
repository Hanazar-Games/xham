# v0.35.0 检查记录

日期：2026-09-21。

- 新增《野良神》第一季50题，简单18、中等17、困难15；三套12题练习与14道考试专属题，每题有原创配图、解析和官网来源。全站1622题、99套练习；目录29／200条目、1450／10,000题。
- 先添加第一季范围、12集覆盖、22个来源锚点及禊条件测试，确认题库缺失时失败，再完成接入。
- `npm test`：331／331通过，覆盖全题库选项、难度、唯一性、图片、来源及题库组合。
- `npm run build`：通过。主JS875.35 kB（gzip 317.83 kB），仍有超过500 kB警告，未调整阈值。
- `npx playwright test tests/catalog.e2e.ts tests/anime-center.e2e.ts tests/loading.e2e.ts tests/images.e2e.ts`：32／32通过，包含新专区入口、第二季仍待制作、目录进度与图片恢复。
- `npx playwright test tests/quiz.e2e.ts tests/exams.e2e.ts -g 'noragami|layout and dialogs'`：11／11通过，覆盖新50题考试全部配图与评分、三套练习及复习重玩、七种屏幕尺寸布局、公告和无障碍。合计43项针对性浏览器回归，未重跑全部旧作品流程或音频专项。
- `npm run test:deployment`：通过，检查 `/xham/` 入口、封面、题目、署名及返回。
- dev-browser检查390px手机困难题：长题干、选项和原创魔法主题图正常显示。本轮复用项目原创SVG，没有新增官方图片资产。
- v0.34.0公告原文归档，更早历史未改；依赖锁文件只变更根项目版本。

来源页模板错误及动画原创范围见[野良神核验记录](quiz-expansion/sources-noragami.md)。下一条目为 #29《Attack on Titan: The Final Season》，总目标尚未完成。
