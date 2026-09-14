import { version } from '../../package.json'

interface Release {
  version: string
  date: string
  title: string
  summary: string
  changes: string[]
}

export const currentRelease: Release = {
  version,
  date: '2026-09-15',
  title: '让每一次挑战，都更顺畅',
  summary: '声音更稳定，交互更安心。看看这次的小进步。',
  changes: [
    '修复声音延迟启动时可能漏掉提示音的问题，快速操作时音效不再不断叠加。',
    '修复快速切换标签页后音乐可能无法恢复的问题，静音和暂停更加平稳。',
    '修复弹窗拖动误关闭的问题，关闭后键盘焦点会回到打开它的按钮。',
    '修复从收藏或挑战记录进入游戏后，「探索更多 Quiz」没有回到发现页的问题。',
    '改善文字对比度、键盘操作与成绩回顾，让答题信息更容易阅读。',
    '新增版本公告入口；旧版本更新内容可在「历史公告」中查阅。',
  ],
}

export const releaseHistory: Release[] = [
  {
    version: '0.2.0',
    date: '2026-09-15',
    title: '好奇心游乐场，声音上线',
    summary: '6 个主题、36 道题，开启一场轻松的脑力挑战。',
    changes: [
      '上线主题题库、搜索分类、随机挑战及本次访问内的收藏。',
      '加入限时答题、积分、答案解析、成绩回顾和挑战记录。',
      '支持主动暂停、弹窗暂停和切换标签页自动暂停。',
      '新增游戏音效、背景音乐、独立开关与音量调节。',
      '优化手机布局、键盘操作和历史成绩回看。',
    ],
  },
]
