import { useCallback, useState } from 'react'
import { quizzes, categories } from './data/quizzes'
import type { Category, Quiz } from './types'
import { Artwork, HeroArtwork } from './components/Artwork'
import { Icon, Logo, type IconName } from './components/Icon'
import { QuizCard } from './components/QuizCard'
import { Dialog } from './components/Dialog'
import { QuizGame } from './game/QuizGame'
import { summarize, type GameState } from './game/engine'
import { QuizResults } from './game/QuizResults'
import { AudioButton, AudioSettings } from './audio/AudioSettings'
import { useAudio } from './audio/AudioProvider'
import { ReleaseNotes } from './components/ReleaseNotes'
import { currentRelease } from './data/releases'

type View = 'discover' | 'saved' | 'results'
const categoryIcons: Record<Category, IconName> = {
  全部: 'grid',
  综合知识: 'bolt',
  科学自然: 'flask',
  世界探索: 'globe',
  文化艺术: 'palette',
}
const featuredQuiz = quizzes.find((quiz) => quiz.id === 'space')!

export default function App() {
  const [view, setView] = useState<View>('discover')
  const [category, setCategory] = useState<Category>('全部')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recommended')
  const [saved, setSaved] = useState<string[]>([])
  const [selected, setSelected] = useState<Quiz | null>(null)
  const [playing, setPlaying] = useState<Quiz | null>(null)
  const [gameId, setGameId] = useState(0)
  const [helpOpen, setHelpOpen] = useState(false)
  const [history, setHistory] = useState<GameState[]>([])
  const [reviewedGame, setReviewedGame] = useState<GameState | null>(null)
  const [audioOpen, setAudioOpen] = useState(false)
  const [releaseOpen, setReleaseOpen] = useState(false)
  const { play } = useAudio()
  const search = query.trim()
  const onComplete = useCallback((state: GameState) => setHistory((items) => [state, ...items]), [])

  const navigate = (next: View) => {
    setView(next)
    setQuery('')
    setCategory('全部')
    window.scrollTo({ top: 0 })
  }
  const openQuiz = (quiz: Quiz) => {
    play('tap')
    setSelected(quiz)
  }
  const randomQuiz = () => openQuiz(quizzes[Math.floor(Math.random() * quizzes.length)])
  const startQuiz = () => {
    setPlaying(selected)
    setSelected(null)
    setGameId((id) => id + 1)
    window.scrollTo({ top: 0 })
  }
  const exitGame = () => {
    setPlaying(null)
    navigate('discover')
  }
  const toggleSave = (id: string) =>
    setSaved((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]))
  const filtered = quizzes
    .filter(
      (quiz) =>
        (view !== 'saved' || saved.includes(quiz.id)) &&
        (category === '全部' || quiz.category === category) &&
        `${quiz.title} ${quiz.description} ${quiz.category}`
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()),
    )
    .sort((a, b) =>
      sort === 'recommended'
        ? 0
        : sort === 'easy'
          ? Number(a.difficulty === '小有挑战') - Number(b.difficulty === '小有挑战')
          : Number(b.difficulty === '小有挑战') - Number(a.difficulty === '小有挑战'),
    )
  const bestScore = history.reduce((best, game) => Math.max(best, summarize(game).score), 0)

  if (playing)
    return (
      <QuizGame
        key={gameId}
        quiz={playing}
        onExit={exitGame}
        onReplay={() => {
          setGameId((id) => id + 1)
          window.scrollTo({ top: 0 })
        }}
        onComplete={onComplete}
      />
    )

  if (reviewedGame)
    return (
      <div className="game-shell">
        <header className="game-header">
          <Logo />
          <div className="game-controls">
            <AudioButton onClick={() => setAudioOpen(true)} />
            <button
              className="secondary-button history-return"
              onClick={() => setReviewedGame(null)}
            >
              <Icon name="back" size={18} />
              返回挑战记录
            </button>
          </div>
        </header>
        <main className="game-main">
          <QuizResults
            state={reviewedGame}
            onExit={() => {
              setReviewedGame(null)
              navigate('discover')
            }}
            onReplay={() => {
              openQuiz(reviewedGame.quiz)
              setReviewedGame(null)
            }}
          />
        </main>
        {audioOpen && <AudioSettings onClose={() => setAudioOpen(false)} />}
      </div>
    )

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        跳到主要内容
      </a>
      <aside className="sidebar">
        <button
          className="brand-button"
          onClick={() => navigate('discover')}
          aria-label="Quizpop 首页"
        >
          <Logo />
        </button>
        <div className="sidebar-label">你的好奇心游乐场</div>
        <nav className="main-nav" aria-label="主导航">
          <button
            className={view === 'discover' ? 'active' : ''}
            aria-current={view === 'discover' ? 'page' : undefined}
            onClick={() => navigate('discover')}
          >
            <Icon name="grid" />
            <span>发现 Quiz</span>
            <span className="nav-dot" />
          </button>
          <button
            className={view === 'saved' ? 'active' : ''}
            aria-current={view === 'saved' ? 'page' : undefined}
            onClick={() => navigate('saved')}
          >
            <Icon name="bookmark" />
            <span>我的收藏</span>
            {saved.length > 0 && <span className="nav-count">{saved.length}</span>}
          </button>
          <button
            className={view === 'results' ? 'active' : ''}
            aria-current={view === 'results' ? 'page' : undefined}
            onClick={() => navigate('results')}
          >
            <Icon name="chart" />
            <span>挑战记录</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="curiosity-card">
            <span className="curiosity-icon">
              <Icon name="sparkles" size={25} />
            </span>
            <h3>大脑也需要游乐时间</h3>
            <p>
              每天一点新知识，
              <br />
              让好奇心保持在线。
            </p>
            <button onClick={randomQuiz}>
              随便玩一局
              <Icon name="arrow" size={16} />
            </button>
          </div>
          <button className="help-button" onClick={() => setHelpOpen(true)}>
            <Icon name="help" size={19} />
            玩法指南
            <Icon name="chevron" size={15} />
          </button>
          <div className="sidebar-footnote">
            MADE FOR CURIOUS MINDS <span>✳</span>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            你的探索空间<span>/</span>
            <strong>
              {view === 'discover' ? '发现 Quiz' : view === 'saved' ? '我的收藏' : '挑战记录'}
            </strong>
          </div>
          <div className="topbar-right">
            <AudioButton onClick={() => setAudioOpen(true)} />
            <button
              className="topbar-help icon-button"
              aria-label="查看玩法指南"
              onClick={() => setHelpOpen(true)}
            >
              <Icon name="help" size={18} />
            </button>
            <span className="mode-label">
              <i />
              单人练习模式
            </span>
            <span className="avatar" aria-label="好奇心玩家">
              Q<span />
            </span>
          </div>
        </header>
        <main className="dashboard" id="main-content" tabIndex={-1}>
          <section className="page-intro">
            <div>
              <div className="eyebrow">STAY CURIOUS. KEEP PLAYING.</div>
              <h1>
                {view === 'discover'
                  ? '今天，发现一点新知。'
                  : view === 'saved'
                    ? '把喜欢的，留给下一次。'
                    : '每次挑战，都算数。'}
                <span className="heading-spark" aria-hidden="true">
                  ✳
                </span>
              </h1>
              <p>
                {view === 'discover'
                  ? '选一个感兴趣的主题，让知识和快乐一起发生。'
                  : view === 'saved'
                    ? '你收藏的好问题，都在这里等你。'
                    : '回看本次访问的挑战成绩，见证每一点进步。'}
              </p>
            </div>
            {view !== 'results' && (
              <div className="search-box">
                <Icon name="search" size={19} />
                <input
                  aria-label="搜索 Quiz"
                  placeholder="搜一搜你的好奇心…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button aria-label="清空搜索" onClick={() => setQuery('')}>
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>
            )}
          </section>

          {view === 'discover' && !search && (
            <button className="release-banner" onClick={() => setReleaseOpen(true)}>
              <Icon name="sparkles" size={21} />
              <span className="release-banner-copy">
                <strong>v{currentRelease.version} 更新公告</strong>
                <span>{currentRelease.summary}</span>
              </span>
              <Icon name="chevron" size={17} />
            </button>
          )}
          {view === 'discover' && !search && (
            <section className="featured-row">
              <div className="hero">
                <div className="hero-content">
                  <span className="hero-kicker">
                    <span />
                    好奇心，准备就绪
                  </span>
                  <h2>
                    不只是答题，
                    <br />
                    是脑洞大开的<span>快乐。</span>
                  </h2>
                  <p>
                    几分钟，一个新世界。
                    <br />
                    让每一个「不知道」变成「原来如此」。
                  </p>
                  <button className="dark-button" onClick={randomQuiz}>
                    <Icon name="shuffle" size={18} />
                    随机来一局
                    <Icon name="arrow" size={18} />
                  </button>
                  <span className="hero-note">无需注册 · 即刻开玩</span>
                </div>
                <HeroArtwork />
              </div>
              <div className="spotlight">
                <div className="spotlight-top">
                  <span>
                    <Icon name="bolt" size={14} />
                    精选挑战
                  </span>
                  <span>编辑推荐</span>
                </div>
                <div className="orbit-decoration" aria-hidden="true">
                  <span />
                  <span />
                  <i>✦</i>
                  <b>✧</b>
                </div>
                <div className="spotlight-content">
                  <span className="spotlight-kicker">HELLO, UNIVERSE</span>
                  <h2>
                    下一站，
                    <br />
                    浩瀚宇宙。
                  </h2>
                  <p>你的宇宙知识，能飞多远？</p>
                  <div className="spotlight-meta">
                    <span>
                      <Icon name="layers" size={14} />
                      {featuredQuiz.questions.length} 道题
                    </span>
                    <span>
                      <Icon name="clock" size={14} />约{' '}
                      {Math.ceil((featuredQuiz.questions.length * featuredQuiz.duration) / 60)} 分钟
                    </span>
                  </div>
                  <button onClick={() => openQuiz(featuredQuiz)}>
                    出发探索
                    <Icon name="arrow" size={18} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {view !== 'results' ? (
            <section className="quiz-library" aria-label="Quiz 题库">
              <div className="library-heading">
                <h2>
                  {view === 'saved' ? '我的收藏' : search ? '搜索结果' : '找点有趣的，开始吧'}
                  <span>{filtered.length}</span>
                </h2>
                <label className="sort-control">
                  <span>排序</span>
                  <select
                    aria-label="题库排序"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option value="recommended">默认推荐</option>
                    <option value="easy">轻松入门优先</option>
                    <option value="challenge">小有挑战优先</option>
                  </select>
                </label>
              </div>
              <div className="category-tabs" role="group" aria-label="主题分类">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={category === item ? 'selected' : ''}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    <Icon name={categoryIcons[item]} size={17} />
                    {item}
                  </button>
                ))}
              </div>
              <span className="sr-only" role="status">
                找到 {filtered.length} 个 Quiz
              </span>
              {filtered.length ? (
                <div className="quiz-grid">
                  {filtered.map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      quiz={quiz}
                      saved={saved.includes(quiz.id)}
                      onSave={() => toggleSave(quiz.id)}
                      onPlay={() => openQuiz(quiz)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Icon
                    name={view === 'saved' && !saved.length ? 'bookmark' : 'search'}
                    size={36}
                  />
                  <h3>
                    {view === 'saved' && !saved.length
                      ? '喜欢的 Quiz，先收藏起来'
                      : '还没找到这个主题'}
                  </h3>
                  <p>
                    {view === 'saved' && !saved.length
                      ? '点击题卡右上角的书签，把感兴趣的挑战放到这里。'
                      : '试试「科学」「世界」，或者看看全部主题。'}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() =>
                      view === 'saved' && !saved.length
                        ? navigate('discover')
                        : (setQuery(''), setCategory('全部'))
                    }
                  >
                    {view === 'saved' && !saved.length ? '去发现 Quiz' : '查看全部主题'}
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
            </section>
          ) : (
            <section className="history-section">
              {history.length ? (
                <>
                  <div className="history-summary">
                    <div>
                      <Icon name="flag" />
                      <span>完成挑战</span>
                      <strong>
                        {history.length}
                        <small> 场</small>
                      </strong>
                    </div>
                    <div>
                      <Icon name="trophy" />
                      <span>最高得分</span>
                      <strong>
                        {bestScore.toLocaleString()}
                        <small> 分</small>
                      </strong>
                    </div>
                    <div>
                      <Icon name="check" />
                      <span>累计答对</span>
                      <strong>
                        {history.reduce((total, game) => total + summarize(game).correct, 0)}
                        <small> 题</small>
                      </strong>
                    </div>
                  </div>
                  <div className="history-list">
                    {history.map((game, index) => (
                      <article key={index} className="history-item">
                        <div className={`history-art ${game.quiz.color}`}>
                          <Artwork kind={game.quiz.artwork} />
                        </div>
                        <div>
                          <span>
                            {game.quiz.category} · {game.quiz.questions.length} 道题
                          </span>
                          <h3>{game.quiz.title}</h3>
                          <p>
                            答对 {summarize(game).correct} 题 · 正确率 {summarize(game).accuracy}%
                          </p>
                        </div>
                        <strong>
                          {summarize(game).score.toLocaleString()}
                          <small> 分</small>
                        </strong>
                        <div className="history-actions">
                          <button
                            className="secondary-button"
                            onClick={() => {
                              setReviewedGame(game)
                              window.scrollTo({ top: 0 })
                            }}
                          >
                            查看成绩
                          </button>
                          <button className="secondary-button" onClick={() => openQuiz(game.quiz)}>
                            再来一局
                            <Icon name="repeat" size={16} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <Icon name="trophy" size={42} />
                  <h3>你的第一场挑战，值得期待</h3>
                  <p>完成一轮 Quiz 后，成绩就会出现在这里。</p>
                  <button className="primary-button" onClick={randomQuiz}>
                    开启第一场挑战
                    <Icon name="arrow" size={18} />
                  </button>
                </div>
              )}
            </section>
          )}
          <footer className="dashboard-footer">
            <button className="release-link" onClick={() => setReleaseOpen(true)}>
              版本公告 · v{currentRelease.version}
            </button>
            <span>
              <Icon name="sparkles" size={15} />
              不必无所不知，只要保持好奇。
            </span>
            <span>
              {view === 'discover'
                ? `${quizzes.length} 个主题 · ${quizzes.reduce((count, quiz) => count + quiz.questions.length, 0)} 个发现新知的机会`
                : '收藏与挑战记录仅在本次访问中保留'}
            </span>
          </footer>
        </main>
      </div>

      {releaseOpen && <ReleaseNotes onClose={() => setReleaseOpen(false)} />}
      {audioOpen && <AudioSettings onClose={() => setAudioOpen(false)} />}
      {selected && (
        <Dialog title="准备好，让好奇心出发？" onClose={() => setSelected(null)}>
          <div className={`dialog-art ${selected.color}`}>
            <Artwork kind={selected.artwork} />
          </div>
          <span className="dialog-category">
            {selected.category} · {selected.difficulty}
          </span>
          <h3 className="dialog-quiz-title">{selected.title}</h3>
          <p className="dialog-description">{selected.description}</p>
          <div className="quiz-rules">
            <span>
              <Icon name="layers" />
              {selected.questions.length} 道单选题
            </span>
            <span>
              <Icon name="clock" />
              每题 {selected.duration} 秒
            </span>
            <span>
              <Icon name="bolt" />
              答得快，得分高
            </span>
          </div>
          <p className="start-note">每题最高 1,000 分 · 答题后解锁知识解析</p>
          <button className="primary-button full-width" onClick={startQuiz}>
            准备好了，开始！
            <Icon name="arrow" size={18} />
          </button>
        </Dialog>
      )}
      {helpOpen && (
        <Dialog title="几分钟，玩出一点新知识。" onClose={() => setHelpOpen(false)}>
          <p className="dialog-description">欢迎来到 Quizpop，好奇心就是你的入场券。</p>
          <ol className="how-to-play">
            <li>
              <span>01</span>
              <div>
                <h3>选一个喜欢的主题</h3>
                <p>浏览题库，也可以用「随机来一局」发现惊喜。</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>在 20 秒内，选出你的答案</h3>
                <p>
                  点击选项，或按键盘 1–4。答对获得 500–1,000
                  分，剩余时间越多，得分越高；答错或超时得 0 分。
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>收获新知识，再看一眼成绩</h3>
                <p>每题都有解析，完成后可回顾所有答案，或再来一局挑战自己。</p>
              </div>
            </li>
          </ol>
          <div className="session-note">
            当前为单人练习。支持暂停，切换标签页会自动暂停；声音可在右上角设置。收藏和挑战记录在刷新页面后清空。
          </div>
          <button className="primary-button full-width" onClick={() => setHelpOpen(false)}>
            明白了，去探索
            <Icon name="arrow" size={18} />
          </button>
        </Dialog>
      )}
    </div>
  )
}
