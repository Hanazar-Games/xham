import { useState, type ReactNode } from 'react'
import type { Quiz, QuizImage } from '../types'
import { Artwork } from './Artwork'
import './quiz-media.css'

function Picture({
  image,
  className,
  fallback,
  decorative = false,
  loading = 'lazy',
}: {
  image: QuizImage
  className: string
  fallback: ReactNode
  decorative?: boolean
  loading?: 'eager' | 'lazy'
}) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    fallback
  ) : (
    <img
      className={className}
      src={image.src}
      alt={decorative ? '' : image.alt}
      loading={loading}
      decoding="async"
      style={image.fit ? { objectFit: image.fit } : undefined}
      onError={() => setFailed(true)}
    />
  )
}

export function QuizArtwork({ quiz }: { quiz: Quiz }) {
  const fallback = <Artwork kind={quiz.artwork} />
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

export function QuestionPicture({ image, showSource }: { image: QuizImage; showSource: boolean }) {
  return (
    <figure className="question-picture">
      <Picture
        key={image.src}
        image={image}
        className="question-image"
        loading="eager"
        fallback={
          <div className="question-image image-unavailable">
            图片暂时无法显示，可根据题目继续作答。
          </div>
        }
      />
      <figcaption>
        <span>{image.credit}</span>
        {showSource && (
          <a href={image.sourceUrl} target="_blank" rel="noreferrer">
            图片来源
          </a>
        )}
      </figcaption>
    </figure>
  )
}
