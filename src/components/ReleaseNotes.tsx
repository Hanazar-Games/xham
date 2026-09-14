import { useState } from 'react'
import { currentRelease, releaseHistory } from '../data/releases'
import { Dialog } from './Dialog'
import './releases.css'

export function ReleaseNotes({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState(false)
  return (
    <Dialog title="每次更新，都多一点好玩。" onClose={onClose}>
      <div className="release-tabs" role="group" aria-label="公告分类">
        <button aria-pressed={!history} onClick={() => setHistory(false)}>
          最新公告
        </button>
        <button aria-pressed={history} onClick={() => setHistory(true)}>
          历史公告
        </button>
      </div>
      {history ? (
        <section aria-label="历史公告">
          <p className="release-intro">过去的每一步，也值得被记住。</p>
          {releaseHistory.map((release) => (
            <details className="historical-release" key={release.version}>
              <summary>
                <strong>v{release.version}</strong>
                <span>{release.title}</span>
              </summary>
              <time dateTime={release.date}>{release.date}</time>
              <p>{release.summary}</p>
              <ul>
                {release.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      ) : (
        <article className="latest-release" aria-label="最新公告">
          <div className="release-meta">
            <span>v{currentRelease.version}</span>
            <time dateTime={currentRelease.date}>{currentRelease.date}</time>
          </div>
          <h3>{currentRelease.title}</h3>
          <p>{currentRelease.summary}</p>
          <ul>
            {currentRelease.changes.map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </article>
      )}
      <button className="primary-button full-width" onClick={onClose}>
        继续探索
      </button>
    </Dialog>
  )
}
