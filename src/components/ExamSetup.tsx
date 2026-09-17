import { useState } from 'react'
import { difficulties, difficultySeconds, type Difficulty, type Quiz } from '../types'
import { questionBanks } from '../data/question-banks'
import { createExam } from '../game/exams'
import type { AnimeSeriesId } from '../types'
import './exam.css'

export function ExamSetup({ series, onStart }: { series: AnimeSeriesId; onStart: (quiz: Quiz) => void }) {
  const bank = questionBanks.find((item) => item.series === series)!
  const [level, setLevel] = useState<Difficulty | '混合'>('混合')
  const [size, setSize] = useState<number | 'all'>(10)
  const pool = bank.questions.filter((q) => level === '混合' || q.difficulty === level)
  const count = size === 'all' ? pool.length : Math.min(size, pool.length)
  return (
    <section className="exam-setup" aria-labelledby="exam-title">
      <div className="exam-intro">
        <div><span className="eyebrow">IP KNOWLEDGE TEST</span><h2 id="exam-title" tabIndex={-1}>{bank.title} · 模拟考试</h2></div>
        <strong>{bank.questions.length}<small> 道配图题</small></strong>
      </div>
      <p>选好难度，抽一张属于你的试卷。混合卷均衡覆盖三档难度，题目与选项顺序随机。</p>
      <fieldset>
        <legend>考试难度</legend>
        <div className="exam-options">
          {(['混合', ...difficulties] as const).map((difficulty) => (
            <button key={difficulty} aria-pressed={level === difficulty} onClick={() => {
              setLevel(difficulty)
              setSize(10)
            }}>{difficulty}<small>{difficulty === '混合' ? bank.questions.length : bank.questions.filter((q) => q.difficulty === difficulty).length} 题可用</small></button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>考试题数</legend>
        <div className="exam-options">
          {([10, 20, 'all'] as const).map((amount) => (
            <button key={amount} disabled={amount !== 'all' && pool.length < amount} aria-pressed={size === amount} onClick={() => setSize(amount)}>
              {amount === 'all' ? `全部 ${pool.length} 题` : `${amount} 题`}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="exam-rules" role="status">本卷 {count} 题 · 每题 {level === '混合' ? 30 : difficultySeconds[level]} 秒 · 百分制，60 分及格。选择后锁定，不能回改；交卷后统一公布答案，允许暂停。</p>
      <button id="start-ip-exam" className="primary-button" onClick={() => onStart(createExam(bank, level, count))}>生成试卷</button>
    </section>
  )
}
