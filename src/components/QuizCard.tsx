import type { Quiz } from '../types'
import { QuizArtwork } from './QuizMedia'
import { Icon } from './Icon'

export function QuizCard({
  quiz,
  saved,
  onSave,
  onPlay,
}: {
  quiz: Quiz
  saved: boolean
  onSave: () => void
  onPlay: () => void
}) {
  return (
    <article className="quiz-card">
      <div className={`card-cover ${quiz.color}`}>
        <button className="cover-link" onClick={onPlay} aria-label={`开始：${quiz.title}`}>
          <QuizArtwork quiz={quiz} />
        </button>
        <span className="cover-tag">{quiz.tag}</span>
        <span className="question-badge">{quiz.questions.length} 道题</span>
        <button
          className={`save-button ${saved ? 'is-saved' : ''}`}
          aria-label={`${saved ? '取消收藏' : '收藏'}：${quiz.title}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Icon name="bookmark" size={17} />
        </button>
      </div>
      <div className="card-content">
        <div className="card-category">
          <span>{quiz.category}</span>
          <span className={`difficulty ${quiz.difficulty === '困难' ? 'medium' : ''}`}>
            <i />
            {quiz.difficulty}
          </span>
        </div>
        <h3>
          <button onClick={onPlay}>{quiz.title}</button>
        </h3>
        <p>{quiz.description}</p>
        <div className="card-footer">
          <span>
            <Icon name="clock" size={14} />约{' '}
            {Math.ceil((quiz.questions.length * quiz.duration) / 60)} 分钟
          </span>
          <button onClick={onPlay}>
            开始挑战
            <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
