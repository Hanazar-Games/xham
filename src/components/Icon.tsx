import type { CSSProperties } from 'react'

const paths = {
  volume: 'M11 5 6 9H3v6h3l5 4zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
  muted: 'M11 5 6 9H3v6h3l5 4zm5 4 6 6m-6 0 6-6',
  music: 'M9 18V5l12-2v13M9 8l12-2M9 18a3 3 0 1 1-3-3h3m12 1a3 3 0 1 1-3-3h3',
  pause: 'M8 5v14M16 5v14',
  play: 'm8 4 12 8-12 8z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  chart: 'M4 20V10m8 10V4m8 16v-7',
  help: 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4m.1 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  back: 'M20 12H4m6-6-6 6 6 6',
  clock: 'M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  layers: 'm12 3 10 5-10 5L2 8zm-10 9 10 5 10-5M2 16l10 5 10-5',
  sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4',
  globe: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c6 5 6 15 0 20-6-5-6-15 0-20',
  flask: 'M9 3h6M10 3v6L4 19a1.4 1.4 0 0 0 1.2 2h13.6a1.4 1.4 0 0 0 1.2-2L14 9V3M7 15h10',
  palette:
    'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-3.7 1.5 1.5 0 0 1 1-2.8h2A4 4 0 0 0 21 11a9 9 0 0 0-9-8ZM7 10h.01M10 6h.01M15 7h.01M7 15h.01',
  bolt: 'm13 2-9 12h7l-1 8 10-13h-8z',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M6 18 18 6',
  trophy: 'M8 3h8v7a4 4 0 0 1-8 0zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8',
  shuffle: 'M3 5h3c5 0 7 14 12 14h3m-4-4 4 4-4 4M3 19h3c2 0 3-2 4-4m4-6c1-2 2-4 4-4h3m-4-4 4 4-4 4',
  flag: 'M5 21V3c5-4 9 4 14 0v10c-5 4-9-4-14 0',
  repeat: 'M3 11V6h15l-3-3m3 3-3 3M21 13v5H6l3 3m-3-3 3-3',
  flame: 'M13 2c1 6-5 5-3 10 1-2 3-3 4-3 1 3 5 4 5 8a7 7 0 0 1-14 0c0-6 7-8 8-15Z',
} as const

export type IconName = keyof typeof paths

export function Icon({
  name,
  size = 20,
  className,
  style,
}: {
  name: IconName
  size?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="logo">
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} width="36" height="36" alt="" />
      <span>
        2d<span className="logo-dot">.</span>
      </span>
    </span>
  )
}
