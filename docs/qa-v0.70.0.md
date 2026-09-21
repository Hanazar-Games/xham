# v0.70.0 检查记录

## 范围

新增清单 #61《DARLING in the FRANXX》50题，限定2018年电视版第1–24集及官网人物、机体、术语资料。简单18／中等17／困难15，三套12题练习与14道考试专属题；每题有本地原创主题图、解析与来源。全站3272题、198套练习、64作品专区加跨番专区。清单62／200、3100／10000，第4段1／20；下一项为#62《Vinland Saga》。

## 核验与测试

- 读取官网24篇分集简介及人物、机体、术语全文，逐题对照来源。区分早期传闻与事实、搭档重组前后名单、机体火力与驾驶员安全、退热与同步值恢复，详见[来源记录](quiz-expansion/sources-darling-in-the-franxx.md)。
- 新范围及关键事实测试先红后绿。最终 `npm test`：9文件、598项通过，覆盖数量、难度、唯一ID、答案轮换、图像、来源及考试生成。
- `npm run build` 通过。主JS 1400.60 kB，gzip 517.87 kB；保留已有大包警告，未修改阈值。
- `npx playwright test tests/catalog.e2e.ts tests/anime-center.e2e.ts tests/loading.e2e.ts tests/images.e2e.ts`：70项通过。包含320px新库入口、范围提示、第4段1个完整条目、下一项仍待制作，以及“国家队”搜索别名。
- `npx playwright test tests/quiz.e2e.ts tests/exams.e2e.ts --grep 'darling-in-the-franxx|layout and dialogs|discovery filters'`：12项通过。覆盖三套练习、50题完整考试、七种尺寸布局、公告与筛选。两组共82项浏览器检查。
- 完整考试逐题验证50张图片解码、选项不溢出、提交前不泄露答案、交卷评分、难度统计、解析、历史和重做。
- `npm run test:deployment` 通过，验证 `/xham/` 子路径入口、封面、题图、图片归属和返回。
- 人工查看Chromium 390×844困难卷首题截图，图片正常、长选项单列、无横向溢出。截图与浏览器状态未进入仓库。
- v0.69.0公告原文归档，既有历史与原始200条清单经脚本核对保持不变。`git diff --check` 通过。

## 限制

题库不包含漫画差异剧情。配图为可复用原创主题SVG，并非官方剧照或每题独占插画。事实核验依据公开官网资料，并非重新观看全片。本轮未修改音频引擎，也没有进行人工音频听感测试。
