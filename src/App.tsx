import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { quizzes } from './data/quizzes'
import { questionBanks } from './data/question-banks'
import { publicUrl } from './public-url'
import { difficulties, type AnimeSeriesId, type Difficulty, type Quiz } from './types'
import { ExamSetup } from './components/ExamSetup'
import { animeSeries } from './data/anime-series'
import { AnimeHub } from './components/AnimeHub'
import { QuizArtwork } from './components/QuizMedia'
import { Icon, Logo } from './components/Icon'
import { QuizCard } from './components/QuizCard'
import { Dialog } from './components/Dialog'
import { QuizGame } from './game/QuizGame'
import { summarize, type GameState } from './game/engine'
import { QuizResults } from './game/QuizResults'
import { AudioButton, AudioSettings } from './audio/AudioSettings'
import { useAudio } from './audio/AudioProvider'
import { ReleaseNotes } from './components/ReleaseNotes'
import { currentRelease } from './data/releases'

type View = 'anime' | 'saved' | 'results'
const normalizeSearch = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[\s:：·-]/g, '')
const searchIndex = new Map(quizzes.map((quiz) => [quiz.id, normalizeSearch([
  quiz.title, quiz.description, quiz.category, quiz.tag,
  ...animeSeries.filter((series) => series.id === quiz.series ||
    quiz.questions.some((question) => question.prompt.startsWith(`【${series.title}】`)))
    .flatMap((series) => [series.title, series.aliases]),
  ...quiz.questions.flatMap((question) => [question.prompt, question.explanation]),
].join(' '))]))

export default function App() {
  const [view, setView] = useState<View>('anime')
  const [series, setSeries] = useState<AnimeSeriesId | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | '全部'>('全部')
  const libraryHeading = useRef<HTMLHeadingElement>(null)
  const returnPoint = useRef({ selector: '#main-heading', scroll: 0 })
  const restoreFocus = useRef(false)
  const [query, setQuery] = useState('')
  const searchInput = useRef<HTMLInputElement>(null)
  const [sort, setSort] = useState('recommended')
  const [saved, setSaved] = useState<string[]>([])
  const [selected, setSelected] = useState<Quiz | null>(null)
  const [playing, setPlaying] = useState<Quiz | null>(null)
  const [gameId, setGameId] = useState(0)
  const [helpOpen, setHelpOpen] = useState(false)
  const [history, setHistory] = useState<{ id: number; game: GameState }[]>([])
  const [reviewedGame, setReviewedGame] = useState<GameState | null>(null)
  const [audioOpen, setAudioOpen] = useState(false)
  const [releaseOpen, setReleaseOpen] = useState(false)
  const { play } = useAudio()
  const search = query.trim()
  const searchTerms = search.split(/\s+/).map(normalizeSearch)
  const onComplete = useCallback((game: GameState) =>
    setHistory((items) => [{ id: gameId, game }, ...items]), [gameId])

  useLayoutEffect(() => {
    if (!restoreFocus.current || playing || reviewedGame || selected) return
    restoreFocus.current = false
    window.scrollTo({ top: returnPoint.current.scroll, behavior: 'instant' })
    const target = document.querySelector<HTMLElement>(returnPoint.current.selector) ?? document.getElementById('main-heading')
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  })

  const navigate = (next: View) => {
    returnPoint.current = { selector: '#main-heading', scroll: 0 }
    restoreFocus.current = true
    setView(next)
    setQuery('')
    setSeries(null)
    setDifficulty('全部')
    window.scrollTo({ top: 0 })
  }
  const openQuiz = (quiz: Quiz, selector = `.quiz-card[data-quiz-id="${quiz.id}"] .cover-link`) => {
    if (!reviewedGame) returnPoint.current = { selector, scroll: window.scrollY }
    play('tap')
    setSelected(quiz)
  }
  const randomQuiz = (pool: readonly Quiz[] = quizzes) => {
    if (!pool.length) return
    openQuiz(pool[Math.floor(Math.random() * pool.length)])
  }
  const startQuiz = () => {
    setPlaying(selected)
    setSelected(null)
    setGameId((id) => id + 1)
    window.scrollTo({ top: 0 })
  }
  const exitGame = () => {
    restoreFocus.current = true
    setPlaying(null)
  }
  const returnToHistory = () => {
    restoreFocus.current = true
    setReviewedGame(null)
  }
  const toggleSave = (id: string) => {
    if (view === 'saved' && saved.includes(id)) {
      const index = filtered.findIndex((quiz) => quiz.id === id)
      const neighbor = filtered[index + 1] ?? filtered[index - 1]
      returnPoint.current = {
        selector: neighbor ? `.quiz-card[data-quiz-id="${neighbor.id}"] .save-button` : '.empty-state button',
        scroll: window.scrollY,
      }
      restoreFocus.current = true
    }
    setSaved((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]))
  }
  const filtered = quizzes
    .filter(
      (quiz) =>
        (view !== 'saved' || saved.includes(quiz.id)) &&
        (!series || quiz.series === series) &&
        (difficulty === '全部' || quiz.difficulty === difficulty) &&
        searchTerms.every((term) => searchIndex.get(quiz.id)!.includes(term)),
    )
    .sort((a, b) =>
      sort === 'recommended'
        ? 0
        : sort === 'easy'
          ? difficulties.indexOf(a.difficulty as Difficulty) - difficulties.indexOf(b.difficulty as Difficulty)
          : difficulties.indexOf(b.difficulty as Difficulty) - difficulties.indexOf(a.difficulty as Difficulty),
    )
  const bestAccuracy = history.reduce((best, { game }) => Math.max(best, summarize(game).accuracy), 0)

  if (playing)
    return (
      <QuizGame
        key={gameId}
        quiz={playing}
        onExit={exitGame}
        onExplore={() => {
          setPlaying(null)
          navigate('anime')
        }}
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
              onClick={returnToHistory}
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
              returnToHistory()
              navigate('anime')
            }}
            onReplay={() => {
              openQuiz(reviewedGame.quiz)
              returnToHistory()
            }}
          />
        </main>
        {audioOpen && <AudioSettings onClose={() => setAudioOpen(false)} />}
      </div>
    )

  return (
    <div className="app-shell anime-page">
      <a href="#main-content" className="skip-link">
        跳到主要内容
      </a>
      <aside className="sidebar">
        <button
          className="brand-button"
          onClick={() => navigate('anime')}
          aria-label="2 dimention 首页"
        >
          <Logo />
        </button>
        <div className="sidebar-label">hanazar 的二次元中心</div>
        <nav className="main-nav" aria-label="主导航">
          <button
            className={view === 'anime' ? 'active' : ''}
            aria-current={view === 'anime' ? 'page' : undefined}
            onClick={() => navigate('anime')}
          >
            <Icon name="sparkles" />
            <span>2 dimention</span>
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
            <h3>下一站，喜欢的世界</h3>
            <p>
              从人物到技能理论，
              <br />
              看看你有多懂这部番。
            </p>
            <button onClick={() => randomQuiz()}>
              全站随机抽卷
              <Icon name="arrow" size={16} />
            </button>
          </div>
          <button className="help-button" onClick={() => setHelpOpen(true)}>
            <Icon name="help" size={19} />
            玩法指南
            <Icon name="chevron" size={15} />
          </button>
          <div className="sidebar-footnote">
            FOR ANIME FANS <span>✳</span>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            hanazar 的二次元中心<span>/</span>
            <strong>
              {view === 'anime' ? '2 dimention' : view === 'saved' ? '我的收藏' : '挑战记录'}
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
              单人练习 / 考试
            </span>
            <span className="avatar" aria-label="动漫挑战者">
              2d<span />
            </span>
          </div>
        </header>
        <main className="dashboard" id="main-content" tabIndex={-1}>
          <section className="page-intro">
            <div>
              <div className="eyebrow">HANAZAR’S ANIME QUIZ CENTER</div>
              <h1 id="main-heading" tabIndex={-1}>
                {view === 'anime' ? '2 dimention'
                  : view === 'saved'
                    ? '收藏喜欢的动漫试卷。'
                    : '你的动漫挑战档案。'}
                <span className="heading-spark" aria-hidden="true">
                  ✳
                </span>
              </h1>
              <p>
                {view === 'anime' ? 'hanazar 的二次元中心 · 每个喜欢的世界，都有下一张试卷。'
                  : view === 'saved'
                    ? '收藏的作品与试卷，随时回来接着挑战。'
                    : '回看本次访问的挑战成绩，见证每一点进步。'}
              </p>
            </div>
            {view !== 'results' && (
              <div className="search-box">
                <Icon name="search" size={19} />
                <input
                  ref={searchInput}
                  aria-label="搜索 Quiz"
                  placeholder="搜索动漫、角色或技能…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button aria-label="清空搜索" onClick={() => {
                    setQuery('')
                    searchInput.current?.focus()
                  }}>
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>
            )}
          </section>

          {view === 'anime' && !search && (
            <button className="release-banner" onClick={() => setReleaseOpen(true)}>
              <Icon name="sparkles" size={21} />
              <span className="release-banner-copy">
                <strong>v{currentRelease.version} 更新公告</strong>
                <span>{currentRelease.summary}</span>
              </span>
              <Icon name="chevron" size={17} />
            </button>
          )}
          {view === 'anime' && !search && (
            <AnimeHub selected={series} onSelect={(next) => {
              setSeries(next)
              requestAnimationFrame(() => {
                const heading = document.getElementById('exam-title') ?? libraryHeading.current
                heading?.focus({ preventScroll: true })
                heading?.scrollIntoView({ block: 'start', behavior: 'instant' })
              })
            }} />
          )}
          {view !== 'results' ? (
            <section className="quiz-library" aria-label="Quiz 题库">
              {view === 'anime' && series && !search && <ExamSetup key={series} series={series} onStart={(quiz) => openQuiz(quiz, '#start-ip-exam')} />}
              <div className="library-heading">
                <h2 ref={libraryHeading} tabIndex={-1}>
                  {search
                    ? `${view === 'saved' ? '收藏中的' : series ? `${animeSeries.find((item) => item.id === series)?.title} · ` : ''}搜索结果`
                    : view === 'anime' ? (series ? `${animeSeries.find((item) => item.id === series)?.title} · 练习卷` : '全部动漫练习卷') : '我的收藏'}
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
                    <option value="easy">简单优先</option>
                    <option value="challenge">困难优先</option>
                  </select>
                </label>
              </div>
              <div className="anime-library-tools">
                  <p>练习卷 · 简单：基础设定 · 中等：情境应用 · 困难：推理辨析</p>
                  {series && <button className="text-button" onClick={() => {
                    setSeries(null)
                    setQuery('')
                    requestAnimationFrame(() => {
                      const destination = document.getElementById('anime-all-series')
                      destination?.focus({ preventScroll: true })
                      destination?.scrollIntoView({ block: 'start', behavior: 'instant' })
                    })
                  }}>切换专区 <Icon name="arrow" size={15} /></button>}
                  <button className="secondary-button" disabled={!filtered.length} title={filtered.length ? '从当前筛选结果抽取试卷' : '没有符合筛选的试卷'} onClick={() => randomQuiz(filtered)}><Icon name="shuffle" size={16} />随机来一局</button>
                  <div className="difficulty-filters" role="group" aria-label="难度筛选">
                    {(['全部', ...difficulties] as const).map((level) => (
                      <button key={level} aria-pressed={difficulty === level} onClick={() => setDifficulty(level)}>
                        {level === '全部' ? '全部难度' : level}
                      </button>
                    ))}
                  </div>
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
                      ? '喜欢的动漫试卷，先收藏起来'
                      : '还没找到这个主题'}
                  </h3>
                  <p>
                    {view === 'saved' && !saved.length
                      ? '点击题卡右上角的书签，把感兴趣的挑战放到这里。'
                      : '试试其他作品或难度，也可以重置全部筛选。'}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => {
                      if (view === 'saved' && !saved.length) return navigate('anime')
                      returnPoint.current = { selector: '.library-heading h2', scroll: window.scrollY }
                      restoreFocus.current = true
                      setQuery('')
                      setSeries(null)
                      setDifficulty('全部')
                    }}
                  >
                    {view === 'saved' && !saved.length ? '去动漫题库' : '重置筛选'}
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
                      <span>最高正确率</span>
                      <strong>
                        {bestAccuracy}
                        <small>%</small>
                      </strong>
                    </div>
                    <div>
                      <Icon name="check" />
                      <span>累计答对</span>
                      <strong>
                        {history.reduce((total, { game }) => total + summarize(game).correct, 0)}
                        <small> 题</small>
                      </strong>
                    </div>
                  </div>
                  <div className="history-list">
                    {history.map(({ game, id }) => (
                      <article key={id} className="history-item" data-history-id={id}>
                        <div className={`history-art ${game.quiz.color}`}>
                          <QuizArtwork quiz={game.quiz} />
                        </div>
                        <div>
                          <span>
                            {game.quiz.mode === 'exam' ? '模拟考试' : '练习'} · {game.quiz.questions.length} 道题
                          </span>
                          <h3>{game.quiz.title}</h3>
                          <p>
                            答对 {summarize(game).correct} 题 · 正确率 {summarize(game).accuracy}%
                          </p>
                        </div>
                        <strong>
                          {summarize(game).score.toLocaleString()}
                          <small>{game.quiz.mode === 'exam' ? ' / 100 分' : ' 分'}</small>
                        </strong>
                        <div className="history-actions">
                          <button
                            className="secondary-button"
                            data-history-action="review"
                            onClick={() => {
                              returnPoint.current = { selector: `[data-history-id="${id}"] [data-history-action="review"]`, scroll: window.scrollY }
                              setReviewedGame(game)
                              window.scrollTo({ top: 0 })
                            }}
                          >
                            查看成绩
                          </button>
                          <button className="secondary-button" data-history-action="replay" onClick={() => openQuiz(game.quiz, `[data-history-id="${id}"] [data-history-action="replay"]`)}>
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
                  <p>完成一套动漫试卷后，成绩就会出现在这里。</p>
                  <button className="primary-button" onClick={() => randomQuiz()}>
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
              重温喜欢的故事，挑战设定与细节。
            </span>
            <span>
              {view === 'anime' ? '2 dimention · hanazar 的二次元中心'
                : '收藏与挑战记录仅在本次访问中保留'}
            </span>
          </footer>
        </main>
      </div>

      {releaseOpen && <ReleaseNotes onClose={() => setReleaseOpen(false)} />}
      {audioOpen && <AudioSettings onClose={() => setAudioOpen(false)} />}
      {selected && (
        <Dialog title="准备好，进入这个动漫世界？" onClose={() => setSelected(null)}>
          <div className={`dialog-art ${selected.color}`}>
            <QuizArtwork quiz={selected} />
          </div>
          <span className="dialog-category">
            {selected.category} · {selected.difficulty}
          </span>
          <h3 className="dialog-quiz-title">{selected.title}</h3>
          <p className="dialog-description">{selected.description}</p>
          {selected.image && (
            <p className="cover-credit">
              {selected.image.credit} ·{' '}
              <a href={publicUrl(selected.image.sourceUrl)} target="_blank" rel="noreferrer">
                图片来源
              </a>
            </p>
          )}
          {selected.scope && <p className="quiz-scope">{selected.scope}</p>}
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
              {selected.mode === 'exam' ? '百分制，不计速度奖励' : '答得快，得分高'}
            </span>
          </div>
          <p className="start-note">{selected.mode === 'exam' ? '60 分及格 · 交卷后解锁全部解析' : '每题最高 1,000 分 · 答题后解锁设定解析'}</p>
          <button className="primary-button full-width" onClick={startQuiz}>
            准备好了，开始！
            <Icon name="arrow" size={18} />
          </button>
        </Dialog>
      )}
      {helpOpen && (
        <Dialog title="动漫考场，开考指南。" onClose={() => setHelpOpen(false)}>
          <p className="dialog-description">欢迎来到 2 dimention，hanazar 的二次元中心。从喜欢的作品和适合的难度开始吧。</p>
          <ol className="how-to-play">
            <li>
              <span>01</span>
              <div>
                <h3>选一个喜欢的动漫专区</h3>
                <p>{questionBanks.filter((bank) => bank.series !== 'crossover').length} 个作品专区各有 50 题与三档难度，可生成模拟考试，也可选择逐题讲解的练习卷。跨番联考另有 {questionBanks.find((bank) => bank.series === 'crossover')!.questions.length} 题。</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>在倒计时内，选出你的答案</h3>
                <p>
                  每题 20–30 秒，以开局说明为准。点击选项，或按键盘 1–4。练习答对获得 500–1,000 分；考试按正确率折算百分制，不计速度奖励。答错或超时不得分。
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>读懂设定解析，再回顾成绩</h3>
                <p>练习逐题显示解析；考试选择后锁定，交卷后统一出成绩和解析，60 分及格。再挑战一次重做同卷，返回专区可重新抽题。</p>
              </div>
            </li>
          </ol>
          <div className="session-note">
            当前为单人练习与模拟考试。支持暂停，切换标签页会自动暂停；声音可在右上角设置。收藏和挑战记录在刷新页面后清空。
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
