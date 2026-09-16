import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { Quiz } from '../types'
import { createGame, gameReducer, summarize, type GameState } from './engine'
import { Icon, Logo } from '../components/Icon'
import { Dialog } from '../components/Dialog'
import { QuizResults } from './QuizResults'
import { useAudio } from '../audio/AudioProvider'
import { AudioButton, AudioSettings } from '../audio/AudioSettings'
import { QuestionPicture } from '../components/QuizMedia'

export function QuizGame({
  quiz,
  onExit,
  onReplay,
  onComplete,
}: {
  quiz: Quiz
  onExit: () => void
  onReplay: () => void
  onComplete: (state: GameState) => void
}) {
  const [state, dispatch] = useReducer(gameReducer, { quiz, now: performance.now() }, createGame)
  const [overlay, setOverlay] = useState<'exit' | 'pause' | 'audio' | null>(null)
  const { play, pauseMusic } = useAudio()
  const lastCue = useRef('')
  const warned = useRef('')
  const reported = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const nextButton = useRef<HTMLButtonElement>(null)
  const feedback = useRef<HTMLDivElement>(null)
  const lastFocus = useRef('')
  const question = quiz.questions[state.index]
  const response = state.responses[state.index]
  const stats = summarize(state)
  const seconds = Math.ceil(state.remainingMs / 1000)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [question.id])
  const openOverlay = useCallback(
    (kind: 'exit' | 'pause' | 'audio') => {
      dispatch({ type: 'pause', questionId: question.id, now: performance.now() })
      setOverlay(kind)
    },
    [question.id],
  )
  const closeOverlay = () => {
    dispatch({ type: 'resume', questionId: question.id, now: performance.now() })
    setOverlay(null)
  }

  useEffect(() => {
    const visibility = () => {
      if (document.hidden && state.phase === 'answering') openOverlay('pause')
    }
    document.addEventListener('visibilitychange', visibility)
    return () => document.removeEventListener('visibilitychange', visibility)
  }, [state.phase, openOverlay])

  useEffect(() => {
    pauseMusic(overlay === 'pause' || overlay === 'exit')
    return () => pauseMusic(false)
  }, [overlay, pauseMusic])

  useEffect(() => {
    const cue =
      state.phase === 'finished'
        ? 'finish'
        : state.phase === 'reveal'
          ? response.correct
            ? 'correct'
            : response.selected === null
              ? 'timeout'
              : 'wrong'
          : state.phase === 'answering' && state.index === 0 && state.responses.length === 0
            ? 'start'
            : null
    const key = `${question.id}-${cue}`
    if (cue && lastCue.current !== key) {
      lastCue.current = key
      play(cue)
    }
  }, [state.phase, state.index, state.responses.length, question.id, response, play])

  useEffect(() => {
    const key = `${question.id}-${seconds}`
    if (state.phase === 'answering' && seconds > 0 && seconds <= 5 && warned.current !== key) {
      warned.current = key
      play('tick')
    }
  }, [state.phase, seconds, question.id, play])

  useEffect(() => {
    if (state.phase !== 'answering') return
    const timer = window.setInterval(
      () => dispatch({ type: 'tick', questionId: question.id, now: performance.now() }),
      100,
    )
    return () => window.clearInterval(timer)
  }, [question.id, state.phase])

  useEffect(() => {
    if (state.phase === 'finished' && !reported.current) {
      reported.current = true
      onComplete(state)
    }
  }, [state, onComplete])

  useEffect(() => {
    const key = `${question.id}-${state.phase}`
    if (overlay || lastFocus.current === key) return
    lastFocus.current = key
    if (state.phase === 'answering') heading.current?.focus({ preventScroll: true })
    if (state.phase === 'reveal') {
      nextButton.current?.focus({ preventScroll: true })
      feedback.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    }
  }, [question.id, state.phase, overlay])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        (event.target instanceof HTMLElement &&
          event.target.closest('input, textarea, select, [contenteditable="true"]')) ||
        document.querySelector('dialog[open]')
      )
        return
      if (state.phase === 'answering' && /^[1-4]$/.test(event.key)) {
        event.preventDefault()
        dispatch({
          type: 'answer',
          questionId: question.id,
          option: Number(event.key) - 1,
          now: performance.now(),
        })
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [question.id, state.phase])

  return (
    <div className="game-shell">
      <header className="game-header">
        <button
          className="brand-button"
          onClick={() => (state.phase === 'finished' ? onExit() : openOverlay('exit'))}
          aria-label="返回首页"
        >
          <Logo />
        </button>
        <span className="game-topic">
          {quiz.category}
          <span>/</span>
          {quiz.title}
        </span>
        <div className="game-controls">
          <AudioButton onClick={() => openOverlay('audio')} />
          {state.phase !== 'finished' && (
            <button
              className="pause-button"
              onClick={() => openOverlay('pause')}
              aria-label="暂停挑战"
            >
              <Icon name="pause" size={18} />
              <span>暂停</span>
            </button>
          )}
          <button
            className="text-button"
            onClick={() => (state.phase === 'finished' ? onExit() : openOverlay('exit'))}
          >
            <Icon name="close" size={18} />
            退出挑战
          </button>
        </div>
      </header>
      <main className="game-main">
        {state.phase === 'finished' ? (
          <QuizResults state={state} onExit={onExit} onReplay={onReplay} />
        ) : (
          <>
            <div className="game-topline">
              <span className="question-position">
                第 <strong>{String(state.index + 1).padStart(2, '0')}</strong> /{' '}
                {String(quiz.questions.length).padStart(2, '0')} 题
              </span>
              <span className="score-pill">
                <Icon name="bolt" size={16} />
                {stats.score.toLocaleString()}
                <small>分</small>
              </span>
            </div>
            <div
              className="question-steps"
              role="group"
              aria-label={`答题进度：第 ${state.index + 1} 题，共 ${quiz.questions.length} 题`}
            >
              {quiz.questions.map((item, index) => (
                <span
                  key={item.id}
                  className={
                    index < state.index
                      ? state.responses[index].correct
                        ? 'step-correct'
                        : 'step-wrong'
                      : index === state.index
                        ? 'step-current'
                        : ''
                  }
                />
              ))}
            </div>
            <section className="question-panel">
              <span className="question-label">单选题 · {quiz.category}</span>
              <div
                className={`timer ${seconds <= 5 && state.phase === 'answering' ? 'timer-urgent' : ''}`}
              >
                <Icon name="clock" size={21} />
                <strong>{seconds}</strong>
                <span>秒</span>
              </div>
              <h1 ref={heading} tabIndex={-1}>
                {question.prompt}
              </h1>
              {question.image ? (
                <QuestionPicture image={question.image} showSource={state.phase === 'reveal'} />
              ) : (
                <p>相信你的直觉，选出一个答案。</p>
              )}
              <div
                className="timer-track"
                role="progressbar"
                aria-label="本题剩余时间"
                aria-valuemin={0}
                aria-valuemax={quiz.duration}
                aria-valuenow={seconds}
              >
                <span style={{ width: `${(state.remainingMs / (quiz.duration * 1000)) * 100}%` }} />
              </div>
            </section>
            <div
              className={`answer-grid ${question.options.some((option) => option.length > 12) ? 'answer-grid-long' : ''}`}
            >
              {question.options.map((option, index) => {
                const revealed = state.phase === 'reveal'
                const correct = revealed && index === question.answer
                const wrong = revealed && index === response.selected && !response.correct
                return (
                  <button
                    key={`${question.id}-${index}`}
                    className={`answer-option option-${index} ${correct ? 'answer-correct' : ''} ${wrong ? 'answer-wrong' : ''} ${revealed && !correct && !wrong ? 'answer-dim' : ''}`}
                    disabled={state.phase !== 'answering'}
                    aria-label={`${index + 1}. ${option}${correct ? '，正确答案' : wrong ? '，你的答案，错误' : ''}`}
                    onClick={() =>
                      dispatch({
                        type: 'answer',
                        questionId: question.id,
                        option: index,
                        now: performance.now(),
                      })
                    }
                  >
                    <span className={`answer-shape shape-${index}`} aria-hidden="true" />
                    <span>{option}</span>
                    <span className="answer-key" aria-hidden="true">
                      {correct ? (
                        <Icon name="check" size={20} />
                      ) : wrong ? (
                        <Icon name="close" size={20} />
                      ) : (
                        index + 1
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
            {state.phase === 'reveal' ? (
              <div
                ref={feedback}
                className={`answer-feedback ${response.correct ? 'feedback-correct' : 'feedback-wrong'}`}
              >
                <div role="status">
                  <h2>
                    <Icon
                      name={
                        response.correct
                          ? 'sparkles'
                          : response.selected === null
                            ? 'clock'
                            : 'help'
                      }
                      size={21}
                    />
                    {response.correct
                      ? `答对了！+${response.points} 分`
                      : response.selected === null
                        ? '时间到！一起记住这个设定。'
                        : '差一点！新设定已经记住。'}
                  </h2>
                  <p className="correct-answer">正确答案：{question.options[question.answer]}</p>
                  <p>{question.explanation}</p>
                  {question.source && (
                    <a
                      className="answer-source"
                      href={question.source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      核对资料 · {question.source.label}
                    </a>
                  )}
                </div>
                <button
                  ref={nextButton}
                  className="dark-button"
                  onClick={() =>
                    dispatch({ type: 'next', questionId: question.id, now: performance.now() })
                  }
                >
                  {state.index === quiz.questions.length - 1 ? '查看成绩' : '下一题'}
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            ) : (
              <p className="keyboard-hint">
                小提示：也可以按键盘 <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> 快速选择 ·
                答得越快，得分越高
              </p>
            )}
          </>
        )}
      </main>
      <span className="sr-only" role="status">
        {state.phase === 'answering' && seconds <= 5 ? '本题仅剩 5 秒，请尽快选择。' : ''}
      </span>
      <footer className="game-footer">
        <Icon name="sparkles" size={15} />
        每一次思考，都值得一个小小的喝彩。
      </footer>
      {overlay === 'audio' && <AudioSettings onClose={closeOverlay} />}
      {overlay === 'pause' && (
        <Dialog title="中场休息，冒险稍后继续。" onClose={closeOverlay}>
          <div className="pause-illustration">
            <Icon name="pause" size={38} />
          </div>
          <p className="dialog-description">
            {state.phase === 'paused'
              ? `计时已暂停，还剩 ${seconds} 秒。`
              : '本题已作答，解析会为你保留。'}
            准备好后继续挑战。
          </p>
          <button className="primary-button full-width" onClick={closeOverlay}>
            <Icon name="play" size={18} />
            继续挑战
          </button>
        </Dialog>
      )}
      {overlay === 'exit' && (
        <Dialog title="结束这轮挑战？" onClose={closeOverlay}>
          <p className="dialog-description">
            {state.phase === 'paused' ? '计时已暂停。' : ''}退出后，本轮进度将不再保留。
          </p>
          <div className="dialog-actions">
            <button className="secondary-button" onClick={onExit}>
              结束挑战
            </button>
            <button className="primary-button" onClick={closeOverlay}>
              继续答题
              <Icon name="arrow" size={18} />
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
