import type { AnimeSeriesId } from '../types'
import { animeSeries } from '../data/anime-series'
import { quizzes } from '../data/quizzes'
import { questionBanks } from '../data/question-banks'
import { QuizArtwork } from './QuizMedia'
import { Icon } from './Icon'
import './anime-hub.css'

const library = quizzes

export function AnimeHub({ selected, onSelect }: {
  selected: AnimeSeriesId | null
  onSelect: (series: AnimeSeriesId | null) => void
}) {
  return (
    <section className="anime-hub" id="anime-worlds" aria-label="动漫专区">
      <div className="anime-welcome">
        <div>
          <span className="anime-kicker">YOUR NEXT ANIME ADVENTURE</span>
          <h2>看过的故事，<br />再认真挑战一次。</h2>
          <p>六个作品专区各 50 题，简单、中等、困难三档。选一个 IP，开始练习或模拟考试。</p>
        </div>
        <dl className="anime-stats">
          <div><dt>动漫专区</dt><dd>{animeSeries.length}</dd></div>
          <div><dt>练习试卷</dt><dd>{library.length}</dd></div>
          <div><dt>逐题配图</dt><dd>{questionBanks.reduce((sum, bank) => sum + bank.questions.length, 0)}</dd></div>
        </dl>
      </div>
      <div className="anime-section-heading">
        <div><span className="eyebrow">CHOOSE YOUR WORLD</span><h2>从喜欢的那一部开始</h2></div>
        <button id="anime-all-series" className="secondary-button" aria-pressed={!selected} onClick={() => onSelect(null)}>全部专区</button>
      </div>
      <div className="anime-series-grid">
        {animeSeries.map((series) => {
          const packs = library.filter((quiz) => quiz.series === series.id)
          const cover = packs.find((quiz) => quiz.id === series.id)!
          return (
            <button
              key={series.id}
              className={`anime-series-card ${selected === series.id ? 'is-selected' : ''}`}
              aria-label={`进入专区：${series.title}`}
              aria-pressed={selected === series.id}
              onClick={() => onSelect(series.id)}
            >
              <span className={`anime-series-art ${cover.color}`}><QuizArtwork quiz={cover} /></span>
              <span className="anime-series-copy">
                <strong>{series.title}</strong>
                <span>{series.subtitle}</span>
                <small>{questionBanks.find((bank) => bank.series === series.id)!.questions.length} 题 · 简单 / 中等 / 困难</small>
              </span>
              <Icon name={selected === series.id ? 'check' : 'arrow'} size={17} />
            </button>
          )
        })}
      </div>
    </section>
  )
}
