# 第101–110项资料核验

核验日期：2026-10-04。十部各50题，共500题；每部简单18、中等17、困难15，供三套12题练习与完整考试使用。配图为项目原创SVG主题示意图，按题材复用，非剧照，不作为答案证据。

Grok配置检查显示API地址、密钥与Tavily密钥均未配置。依据项目已记录授权，直接读取作品官网、吉卜力、VIZ、日本电视台与万代频道的资料。万代频道以日文标题搜索接口确认作品ID，再读取分集正文；只采用作品简介，不采用观众评论。研究缓存和OCR临时图不提交。

## 作品与范围

| 目录 | 题库 | 范围 | 正版分集入口 |
| --- | --- | --- | --- |
| 101 | 中二病也要谈恋爱！ 第一季 | 限定2012年电视动画第一季第 1–12 集、同期人物及制作资料，含关系变化与最终集剧透；不含番外、第二季和电影。 | [第1集](https://www.b-ch.com/titles/3630/001) |
| 102 | 终结的炽天使 第一部分 | 限定2015年电视动画第一部分第 1–12 集及其中人物、制作知识，含吸血鬼身份与新宿战役剧透；不混入第13集起的名古屋决战篇或漫画后续。 | [第1集](https://www.b-ch.com/titles/4529/001) |
| 103 | 欢迎来到实力至上主义的教室 第一季 | 限定2017年电视动画第一季第 1–12 集及同期人物、制作资料，含积分规则、须藤事件和无人岛考试剧透；不含第二季或小说后续。 | [第1集](https://www.b-ch.com/titles/5689/001) |
| 104 | 魔法少女小圆 2011电视版 | 限定2011年原版电视动画第 1–12 集及其制作音乐资料，含灵魂宝石、魔女与人物命运重大剧透；不混入电影、外传或2025年电影重剪TV Edition。 | [第1集](https://www.b-ch.com/titles/3071/001) |
| 105 | 东京复仇者 第一季 | 限定2021年电视动画第一季第 1–24 集，含八三抗争、血色万圣节和时间线变化剧透；原时间线与介入后按题干区分，不含圣夜决战及天竺篇。 | [第1集](https://www.b-ch.com/titles/7265/001) |
| 106 | 幽灵公主 | 限定1997年动画电影的公开剧情、配音、制作日志及1998年交响组曲知识，含诅咒与森林冲突剧透；电影漫画仅核对影片剧情，不含早期绘本的不同故事。 | [吉卜力作品页](https://www.ghibli.jp/works/mononoke/) |
| 107 | 多罗罗 2019版 | 限定2019年电视动画第 1–24 集及官网人物资料，含身世、十二鬼神与醍醐城之战剧透；不混用1969年动画或漫画的身体部位数量。 | [第1集](https://www.b-ch.com/titles/7546/001) |
| 108 | JOJO的奇妙冒险 星尘斗士 前半部 | 限定2014年《星尘斗士》前半部第 1–24 集，含替身能力与旅途袭击剧透；不含第25集起的埃及篇、OVA或后续部数。 | [第1集](https://www.b-ch.com/titles/4080/001) |
| 109 | 混沌武士 | 限定2004–2005年电视动画第 1–26 集的正版分集剧情，含旅途往事与终章交战剧透；不采用未核验的终局细节或漫画独有情节。 | [第1集](https://www.b-ch.com/titles/328/001) |
| 110 | 我的英雄学院 第五季 | 限定电视动画第五季累计第 89–113 集，含联合训练、黑鞭、事务所实习和敌联盟篇剧透；按动画播出顺序并注明回忆时间，不含第六季、OVA或电影。 | [第1集](https://www.b-ch.com/titles/7275/001) |

## 来源编号

九部电视作品的数字1至末集对应万代频道三位分集路径（如`/001`）；我英使用累计89–113为资料编号，URL换算为001–025。已逐页读取这171份简介并核对作品名称和实际集号。

- 中二病：101–111依次为勇太、六花、森夏、茴香、凸守、勇太母亲、樟叶、梦叶、一色、七濑、十花的[第一季人物卡](https://www.anime-chu-2.com/tv/character/)；201为[制作名单](https://www.anime-chu-2.com/tv/staff-cast/)。人物卡描述存于图片，读取实际图像并OCR核对；幻想版与现实版介绍在题干中区分。小说、番外和续季未采入。
- 炽天使：101–110依次为`yu/mika/guren/shinoa/yoichi/kimizuki/mitsuba/ferid/krul/asuramaru`的[官网人物页](https://owarino-seraph.jp/chara/index.html)；201为[制作名单](https://owarino-seraph.jp/staff/index.html)。官网合并了前后两部分信息，仅取前半人物的基础介绍。分集ID4529与后半4894分开。
- 实教：`characters`为[第一季人物资料](https://you-zitsu.com/1st/character/)，201为[第一季制作资料](https://you-zitsu.com/1st/staffcast/)。角色表只取社团、性格、学业与职务信息。
- 小圆：`characters`为[原版人物资料](https://www.madoka-magica.com/tv/youtube-streaming/character/)，101为[原版故事介绍](https://www.madoka-magica.com/tv/youtube-streaming/)，201为[原版制作及音乐名单](https://www.madoka-magica.com/tv/youtube-streaming/staff/)。`/tv/`首页现为电影重剪TV Edition，不用于2011版制作职位判断；原版导演新房昭之与系列导演宫本幸裕按原版名单区分。
- 多罗罗：`characters`为[2019版人物表](https://dororo-anime.com/character.html)。十二体鬼神、义手刀、身体感知和亲属关系按此版核对，分集使用7546，避免1969版1595。
- 东复、星尘斗士、混沌武士、我英第五季均直接使用对应集数的万代频道简介。星尘斗士前半4080与埃及篇4452分开；我英本季7275的第001集就是累计第89集。

## 幽灵公主编号表

电影题库包括公开剧情、配音与制作技术，并明确含1998年交响组曲；不把后来的组曲当成1997年电影原声录音。早期《The First Story》绘本不作为电影情节来源。

| 编号 | 来源 |
| --- | --- |
| 1 | [吉卜力电影作品资料](https://www.ghibli.jp/works/mononoke/) |
| 2 | [日本电视台电影介绍（2025年文章）](https://kinro.ntv.co.jp/article/detail/20250725) |
| 3 | [日本电视台电影介绍（2023年文章）](https://kinro.ntv.co.jp/article/detail/20230616) |
| 4 | [VIZ电影漫画合订本简介](https://www.viz.com/manga-books/manga/princess-mononoke-film-comic-all-in-one-edition/product/8678) |
| 5 | [VIZ电影漫画第2卷简介](https://www.viz.com/manga-books/film-comic/princess-mononoke-film-comics-volume-2-0/product/738) |
| 6 | [VIZ电影漫画第3卷简介](https://www.viz.com/manga-books/film-comic/princess-mononoke-film-comics-volume-3-0/product/739) |
| 7 | [VIZ电影漫画第4卷简介](https://www.viz.com/manga-books/film-comic/princess-mononoke-film-comics-volume-4-0/product/740) |
| 8 | [VIZ电影漫画第5卷简介](https://www.viz.com/manga-books/film-comic/princess-mononoke-film-comics-volume-5-0/product/741) |
| 9 | [吉卜力1997年2月制作日志](https://www.ghibli.jp/diary_m/972.html) |
| 10 | [吉卜力1997年3月制作日志](https://www.ghibli.jp/diary_m/973.html) |
| 11 | [吉卜力1997年4月制作日志](https://www.ghibli.jp/diary_m/974.html) |
| 12 | [吉卜力1997年6月制作日志](https://www.ghibli.jp/diary_m/976.html) |
| 13 | [吉卜力1998年交响组曲录音记录](https://www.ghibli.jp/diary_m/ceska/) |

制作日志具体核对点：2月21日角色录音；3月3日巨人画面的遮罩工作量、3月4日配音；4月混合上色及24日SGI设备；6月7日六声道声音、13日零号试映临时切换模拟音轨。演员姓名在日志中部分遮字，与吉卜力作品页完整演职员姓名交叉核对。

## 内容自查

- 所有选项原始数据以第一项为正确答案，接入时统一轮换位置；不在图片中标出答案。
- 东复原时间线的一虎与Mikey命运，和武道干预后的结果分开提问。
- 我英第108集回溯约十月，和前面冬季实习的播出顺序分开；题目不推断第六季结果。
- 魔法少女资料的现实代价、角色自我设定、公开剧情与制作资料分别标注来源，不依据插画推断结论。
- 资料未公开的终局细节不设题；外部页面能访问不等于所有剧情均获核验。失效或重定向至目录的NTV旧排期、403的发行网页均未列为题目来源。
