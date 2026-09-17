import { useRef, useState } from 'react'
import type { AnimeSeriesId } from '../types'
import { Dialog } from './Dialog'
import { expansionBatchCount, expansionItems, expansionReady, expansionTarget, filterExpansion } from '../data/expansion'
import './expansion-catalog.css'

export function ExpansionCatalog({ onClose, onSelect }: { onClose: () => void; onSelect: (series: AnimeSeriesId) => void }) {
  const [batch, setBatch] = useState<number | 'all'>(1)
  const [query, setQuery] = useState('')
  const searchInput = useRef<HTMLInputElement>(null)
  const items = filterExpansion(batch, query)
  return (
    <Dialog title="动漫题库制作目录" onClose={onClose}>
      <p className="catalog-intro">按原清单分为 {expansionBatchCount} 段，每段 20 个条目。每个条目目标 {expansionTarget} 题，续季和不同版本独立整理。</p>
      <div className="catalog-summary">
        <p><strong>{expansionReady} / {expansionItems.length}</strong><span>清单条目已收录</span></p>
        <p><strong>{(expansionReady * expansionTarget).toLocaleString()} / {(expansionItems.length * expansionTarget).toLocaleString()}</strong><span>已对应题目 / 计划目标</span></p>
      </div>
      <p className="catalog-note">这里只统计清单中已对应的独立题库；现有综合题库另计。待制作条目暂不能开考。</p>
      <div className="catalog-filters">
        <label>分段<select aria-label="目录分段" value={batch} onChange={(event) => setBatch(event.target.value === 'all' ? 'all' : Number(event.target.value))}>
          <option value="all">全部 200 条目</option>
          {Array.from({ length: expansionBatchCount }, (_, index) => <option key={index} value={index + 1}>第 {index + 1} 段 · {index * 20 + 1}–{(index + 1) * 20}</option>)}
        </select></label>
        <label>作品<input ref={searchInput} type="search" aria-label="目录作品搜索" placeholder="搜索当前范围的作品名" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      </div>
      <p className="catalog-count" role="status">当前范围找到 {items.length} 个条目 · 已收录 {items.filter((item) => item.bank).length} 个</p>
      {items.length ? <ol className="catalog-list">
        {items.map((item) => <li className="catalog-item" key={item.id} data-number={item.number}>
          <div className="catalog-item-heading"><span>#{item.number}</span><h3>{item.title}</h3></div>
          <p className={item.bank ? 'catalog-ready' : 'catalog-pending'}>{item.bank ? '已收录' : '待制作'} · {item.bank ? expansionTarget : 0} / {expansionTarget} 题</p>
          {item.note && <p className="catalog-note">{item.note}</p>}
          {item.bank && <button className="secondary-button" aria-label={`进入题库：${item.title}`} onClick={() => {
            onClose()
            onSelect(item.bank!.series)
          }}>进入题库</button>}
        </li>)}
      </ol> : <div className="catalog-empty"><p>这个范围内没有匹配作品。</p><button className="secondary-button" onClick={() => {
        setBatch(1)
        setQuery('')
        searchInput.current?.focus()
      }}>重置目录筛选</button></div>}
    </Dialog>
  )
}
