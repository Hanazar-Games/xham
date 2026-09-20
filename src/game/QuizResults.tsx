import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { QuestionPicture } from '../components/QuizMedia'
import { summarize, type GameState } from './engine'
import { difficulties } from '../types'

export function QuizResults({
  state,
  onExit,
  onReplay,
}: {
  state: GameState
  onExit: () => void
  onReplay: () => void
}) {
  const { quiz } = state
  const stats = summarize(state)
  const [showReview, setShowReview] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
  }, [])
  return (
    <div className="result-view">
      <div className="result-trophy" aria-hidden="true">
        <Icon name="trophy" size={54} />
        <span>✦</span>
        <span>✦</span>
      </div>
      <span className="eyebrow">{quiz.mode === 'exam' ? 'TEST COMPLETE' : 'CHALLENGE COMPLETE'}</span>
      <h1 ref={heading} tabIndex={-1}>
        {stats.accuracy === 100
          ? '全对！这些设定细节你都记得。'
          : stats.accuracy >= 50
            ? '挑战完成，又懂了一点动漫设定！'
            : '每一个问号，都是新的开始。'}
      </h1>
      <p className="result-description">「{quiz.title}」已完成，来看看你的表现吧。</p>
      <div className="result-stats">
        <div>
          <Icon name="bolt" />
          <strong>{stats.score.toLocaleString()}</strong>
          <span>{quiz.mode === 'exam' ? '考试得分 / 100' : '本轮得分'}</span>
        </div>
        <div>
          <Icon name="check" />
          <strong>
            {stats.correct}
            <small> / {quiz.questions.length}</small>
          </strong>
          <span>答对题数</span>
        </div>
        <div>
          <Icon name="flag" />
          <strong>
            {stats.accuracy}
            <small>%</small>
          </strong>
          <span>正确率</span>
        </div>
        <div>
          <Icon name="flame" />
          <strong>{stats.bestStreak}</strong>
          <span>最高连对</span>
        </div>
      </div>
      {quiz.mode === 'exam' && <>
        <p className="exam-verdict">{stats.accuracy >= 60 ? '考试及格' : '尚未及格'} · 及格线 60 分 · 各题等权，不计速度</p>
        <section className="exam-breakdown" aria-label="分难度成绩">
          {difficulties.map((level) => {
            const indices = quiz.questions.flatMap((q, index) => q.difficulty === level ? [index] : [])
            if (!indices.length) return null
            return <p key={level}>{level}：{indices.filter((index) => state.responses[index].correct).length} / {indices.length} 题</p>
          })}
        </section>
      </>}
      <div className="result-actions">
        <button className="primary-button" onClick={onReplay}>
          <Icon name="repeat" size={18} />
          {quiz.mode === 'exam' ? '重做本卷' : '再挑战一次'}
        </button>
        <button className="secondary-button" onClick={onExit}>
          探索更多 Quiz
          <Icon name="arrow" size={18} />
        </button>
      </div>
      <button
        className="review-toggle"
        aria-expanded={showReview}
        onClick={() => setShowReview((value) => !value)}
      >
        {showReview ? '收起答案回顾' : '查看答案与解析'}
        <Icon name="chevron" size={17} className={showReview ? 'rotate-up' : 'rotate-down'} />
      </button>
      {showReview && (
        <section className="answer-review" aria-label="答案回顾">
          {quiz.questions.map((item, index) => {
            const answer = state.responses[index]
            return (
              <article key={item.id} className="review-item">
                <div className={`review-status ${answer.correct ? 'correct' : 'incorrect'}`}>
                  <Icon name={answer.correct ? 'check' : 'close'} size={18} />
                </div>
                <div>
                  <h3>
                    <span>{index + 1}.</span> {item.prompt}
                  </h3>
                  {item.image && <QuestionPicture image={item.image} showSource loading="lazy" />}
                  <p>
                    你的答案：
                    {answer.selected === null ? '超时未作答' : item.options[answer.selected]}
                    <span className="review-correct">正确答案：{item.options[item.answer]}</span>
                  </p>
                  <p className="review-explanation">{item.explanation}</p>
                  {item.source && (
                    <a
                      className="answer-source"
                      href={item.source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      核对资料 · {item.source.label}
                    </a>
                  )}
                </div>
                <strong className="review-points">{quiz.mode === 'exam' ? answer.correct ? '答对' : '未得分' : `+${answer.points}`}</strong>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
