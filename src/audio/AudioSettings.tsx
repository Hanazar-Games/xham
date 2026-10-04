import { useEffect, useRef } from 'react'
import { Dialog } from '../components/Dialog'
import { Icon } from '../components/Icon'
import { useAudio } from './AudioProvider'

export function AudioSettings({ onClose, paused = false }: { onClose: () => void; paused?: boolean }) {
  const { options, configure, play, stopSfx, unlock, unavailable } = useAudio()
  const previewToken = useRef(0)
  useEffect(
    () => () => {
      previewToken.current += 1
      stopSfx()
    },
    [stopSfx],
  )
  const preview = async (cue: 'correct' | 'tap' = 'tap', force = false) => {
    if ((!force && !options.sfx) || options.volume === 0) return
    const token = ++previewToken.current
    if ((await unlock()) && token === previewToken.current) play(cue)
  }
  return (
    <Dialog title="给冒险配一点声音。" onClose={onClose}>
      <p className="dialog-description">{paused ? '计时已暂停，调好声音后继续答题。' : '轻柔的旋律和及时的反馈，节奏由你决定。'}</p>
      <div className="audio-option">
        <div>
          <Icon name="volume" />
          <div>
            <h3>游戏音效</h3>
            <p>答题反馈、倒计时和完成提示</p>
          </div>
        </div>
        <button
          className="audio-switch"
          role="switch"
          aria-checked={options.sfx}
          aria-label="游戏音效"
          onClick={() => {
            const next = !options.sfx
            configure({ sfx: next })
            if (next) void preview('correct', true)
          }}
        >
          <span />
        </button>
      </div>
      <div className="audio-option">
        <div>
          <Icon name="music" />
          <div>
            <h3>背景音乐</h3>
            <p>轻快循环，答题反馈时自动降低音乐音量</p>
          </div>
        </div>
        <button
          className="audio-switch"
          role="switch"
          aria-checked={options.music}
          aria-label="背景音乐"
          onClick={() => {
            void unlock()
            configure({ music: !options.music })
          }}
        >
          <span />
        </button>
      </div>
      <label className="volume-control">
        <span>
          总音量 <strong>{Math.round(options.volume * 100)}%{options.volume === 0 && ' · 已静音'}</strong>
        </span>
        <input
          type="range"
          aria-label="总音量"
          aria-valuetext={options.volume === 0 ? '0%，已静音' : `${Math.round(options.volume * 100)}%`}
          min="0"
          max="100"
          step="5"
          value={Math.round(options.volume * 100)}
          onChange={(event) => configure({ volume: Number(event.target.value) / 100 })}
          onPointerUp={() => void preview('tap')}
          onKeyUp={(event) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) void preview('tap')
          }}
        />
      </label>
      {unavailable && (
        <p className="audio-error" role="status">
          浏览器暂时无法播放声音，可再次尝试开启。静音状态下仍可正常答题。
        </p>
      )}
      <div className="dialog-actions">
        <button
          className="secondary-button"
          disabled={!options.sfx || options.volume === 0}
          onClick={() => void preview('correct')}
        >
          <Icon name="volume" size={18} />
          试听音效
        </button>
        <button className="primary-button" onClick={onClose}>
          设置好了
          <Icon name="check" size={18} />
        </button>
      </div>
      <p className="audio-note">开启音效或调整音量会给出短提示<br />切换标签页时自动静音，设置仅在本次访问生效</p>
    </Dialog>
  )
}

export function AudioButton({ onClick }: { onClick: () => void }) {
  const { options, unavailable } = useAudio()
  const muted = unavailable || (!options.sfx && !options.music) || options.volume === 0
  const state = unavailable ? '不可用' : muted ? '静音' : options.music ? '音乐开启' : '音效开启'
  return (
    <button className="audio-button" onClick={onClick} aria-label="声音设置" title={`声音设置 · ${state}`}>
      <Icon name={muted ? 'muted' : 'volume'} size={18} />
      <span>声音</span>
      <span className="audio-state">{state}</span>
      {!unavailable && options.music && options.volume > 0 && <i className="music-dot" />}
    </button>
  )
}
