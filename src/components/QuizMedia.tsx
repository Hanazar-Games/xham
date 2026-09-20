import { useRef, useState, type ReactNode } from 'react'
import type { Quiz, QuizImage } from '../types'
import { AnimeArtwork } from './Artwork'
import './quiz-media.css'
import { publicUrl } from '../public-url'

function Picture({
  image,
  className,
  fallback,
  decorative = false,
  loading = 'lazy',
}: {
  image: QuizImage
  className: string
  fallback: ReactNode | ((retry: () => void) => ReactNode)
  decorative?: boolean
  loading?: 'eager' | 'lazy'
}) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    typeof fallback === 'function' ? fallback(() => setFailed(false)) : fallback
  ) : (
    <img
      className={className}
      src={publicUrl(image.src)}
      alt={decorative ? '' : image.alt}
      loading={loading}
      decoding="async"
      style={image.fit ? { objectFit: image.fit } : undefined}
      onError={() => setFailed(true)}
    />
  )
}

export function QuizArtwork({ quiz }: { quiz: Quiz }) {
  const fallback = <AnimeArtwork />
  return quiz.image ? (
    <Picture
      key={quiz.image.src}
      image={quiz.image}
      className={`quiz-cover-image ${quiz.image.fit === 'contain' ? 'quiz-cover-contain' : ''}`}
      decorative
      fallback={fallback}
    />
  ) : (
    fallback
  )
}

export function QuestionPicture({ image, showSource, timed = false, loading = 'eager' }: {
  image: QuizImage
  showSource: boolean
  timed?: boolean
  loading?: 'eager' | 'lazy'
}) {
  const figure = useRef<HTMLElement>(null)
  return (
    <figure
      ref={figure}
      tabIndex={-1}
      aria-label="题目图片"
      className={`question-picture ${image.fit === 'scale-down' ? 'question-picture-compact' : ''}`}
    >
      <Picture
        key={image.src}
        image={image}
        className="question-image"
        loading={loading}
        fallback={(retry) => (
          <div className="question-image image-unavailable">
            <p role="status">图片暂时无法显示，可重试或阅读文字题面。{timed && '重试不会暂停计时。'}</p>
            <button className="secondary-button" onClick={() => {
              retry()
              figure.current?.focus({ preventScroll: true })
            }}>重新加载图片</button>
          </div>
        )}
      />
      <figcaption>
        <span>{image.credit}</span>
        {showSource && (
          <a href={publicUrl(image.sourceUrl)} target="_blank" rel="noreferrer">
            图片来源
          </a>
        )}
      </figcaption>
    </figure>
  )
}
