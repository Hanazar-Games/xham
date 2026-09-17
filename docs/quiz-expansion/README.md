# 200 个动漫条目的题库制作清单

用户清单已完整保存于 [catalog.json](catalog.json)，保持原英文标题、编号和顺序。原附件为连续编号，未包含「、」；按每 20 个条目切成 10 段，每条目目标 50 题，共约 10,000 题。

v0.11.0 首页提供「查看 200 条目制作目录」，支持分段浏览、当前范围搜索与已有题库直达。目录按真实题池显示进度，不把待制作条目、跨季综合题库或电影合集记作完整独立题库；本版仍有 372 道可玩题目。

## 制作约定

- 每条目简单 18、中等 17、困难 15，共 50 道独立题目，全部有图片、解析和可核查资料。
- 季度、续作、剧场版及不同改编版本保留独立条目。不能将同一批题复制给多个季度充数；每个条目在写题前明确剧情范围。
- 裸标题与后续季度同时出现时，先核查所指版本与范围，避免把后续剧透混入早期题库。
- 新配图使用项目原创主题 SVG，明确标注为示意图；不增加未经许可的官方角色图。
- 接入现有随机抽题、三档难度、百分制考试、解析和重做系统。完成内容核验与测试后再开放入口，待制作条目不显示为可玩的空题库。
- 后续继续工作时先读取本目录，从当前段第一个未完成条目接续；用户发送「、」可作为进入下一段的指示。

## 分段

| 段 | 编号 | 起止条目 | 目标题数 | 已有可复用题库 |
| --- | --- | --- | --- | --- |
| 1 | 1–20 | Attack on Titan → Attack on Titan Season 3 Part 2 | 1,000 | 鬼灭、火影、海贼王，共 150 题 |
| 2 | 21–40 | No Game No Life → Sword Art Online II | 1,000 | Re:0 需先拆分剧情范围 |
| 3 | 41–60 | Cowboy Bebop → JoJo's Bizarre Adventure | 1,000 | 无完整对应题库 |
| 4 | 61–80 | Darling in the FranXX → Elfen Lied | 1,000 | 无完整对应题库 |
| 5 | 81–100 | Horimiya → Hyouka | 1,000 | 无完整对应题库 |
| 6 | 101–120 | Love, Chunibyo & Other Delusions! → Kuroko's Basketball | 1,000 | 芙莉莲，共 50 题 |
| 7 | 121–140 | Tokyo Ghoul:re → Dr. Stone: Stone Wars | 1,000 | 无完整对应题库 |
| 8 | 141–160 | Log Horizon → Mushoku Tensei: Jobless Reincarnation Part 2 | 1,000 | 无完整对应题库 |
| 9 | 161–180 | I Want to Eat Your Pancreas → Oshi no Ko | 1,000 | 无完整对应题库 |
| 10 | 181–200 | Cyberpunk: Edgerunners → High School DxD New | 1,000 | 无完整对应题库 |

「已有可复用」指当前项目中确实存在且通过题量、三档难度、图片与来源校验的 50 题题池。其他条目不能因属于同一系列而自动记作完成。现有吉卜力综合题池不能当作清单中每部电影各 50 题；Re:0 现有题池含动画前两季，不直接计入任何单季目标。跨番联考不计入这 200 个条目的目标。

## 接续位置与实际进度

用户连续发送两次「、」，接续标记已到第 3 段（41–60 项，Cowboy Bebop 至 JoJo's Bizarre Adventure）。分段标记不代表上一段制作完成：第 1 段仍有 17 项待制作，第 2、3 段尚未完成新题制作。资料核验恢复后，先补齐最早未完成的条目，再按原顺序推进。

2026-09-18 在第 3 段接续时重新调用 Grok，仍返回 `GROK_API_URL` 未配置；本次只更新接续记录，未增加题目或改变线上可玩数量。

### 第 1 段明细

| 编号 | 条目 | 状态 |
| --- | --- | --- |
| 1 | Attack on Titan | 待核验来源、明确首季范围并制作 |
| 2 | Death Note | 待核验来源并制作 |
| 3 | Fullmetal Alchemist: Brotherhood | 待核验来源并制作；与第 87 项分开 |
| 4 | One Punch Man | 待核验来源、明确首季范围并制作 |
| 5 | Demon Slayer | 已有 50 题，范围为立志篇 |
| 6 | My Hero Academia | 待核验来源、明确首季范围并制作 |
| 7 | Sword Art Online | 待核验来源、明确首季范围并制作 |
| 8 | Hunter x Hunter | 待核验来源及动画版本并制作 |
| 9 | Naruto | 已有 50 题，范围为寻找纲手之前及该篇章 |
| 10 | Jujutsu Kaisen | 待核验来源、明确首季范围并制作 |
| 11 | Tokyo Ghoul | 待核验来源、明确首季范围并制作 |
| 12 | Your Name | 待核验来源并制作 |
| 13 | Attack on Titan Season 2 | 待核验该季来源并制作 |
| 14 | Steins;Gate | 待核验来源并制作 |
| 15 | Naruto: Shippuden | 待核验来源并制作，不复用早期篇章充数 |
| 16 | My Hero Academia 2nd Season | 待核验该季来源并制作 |
| 17 | One Piece | 已有 50 题，范围为伙伴与船只基础设定 |
| 18 | Attack on Titan Season 3 | 待核验上半季来源，与第 20 项分开 |
| 19 | A Silent Voice | 待核验来源并制作 |
| 20 | Attack on Titan Season 3 Part 2 | 待核验后半季来源并制作 |

2026-09-18 实测 Grok 检索失败：`GROK_API_URL` 未配置。用户提供的 AGENTS.md 限制资料仅来自项目或 Grok/Context7。因此本次仅完成清单持久化、分段和已有题池校验，没有将新 IP 的未经核实题目写入正式题库。继续制作需要恢复 Grok，或由用户明确允许直接核查作品官网、出版方等资料。
