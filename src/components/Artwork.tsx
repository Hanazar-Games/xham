import type { ArtworkKind } from '../types'

function Star({
  x,
  y,
  size = 16,
  color = 'currentColor',
}: {
  x: number
  y: number
  size?: number
  color?: string
}) {
  return (
    <path
      d="m0-1 .25.65.75.35-.75.25L0 1l-.25-.75L-1 0l.75-.35Z"
      transform={`translate(${x} ${y}) scale(${size})`}
      fill={color}
    />
  )
}

export function Artwork({ kind, className = '' }: { kind: ArtworkKind; className?: string }) {
  return (
    <svg className={`artwork ${className}`} viewBox="0 0 360 190" fill="none" aria-hidden="true">
      {kind === 'brain' && (
        <>
          <circle cx="186" cy="98" r="74" fill="#c9b9ed" opacity=".45" />
          <g transform="translate(115 25) rotate(-8 65 70)">
            <path
              d="M66 20C48 3 27 16 25 34 7 35 0 58 12 71-1 91 12 112 30 113c0 21 28 31 40 12 15 18 40 8 40-12 21-1 33-23 19-41 10-19-1-37-19-39C103 11 81 6 66 20Z"
              fill="#9d7bcf"
              stroke="#604282"
              strokeWidth="3"
            />
            <path
              d="M67 23v90M27 37c22-2 26 13 21 22M15 72c14-8 24-1 26 10M31 111c-5-13 1-26 15-26M108 37c-20-3-28 10-22 24m41 11c-19-9-30 1-30 14m14 25c3-10-3-24-14-22"
              stroke="#604282"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse cx="51" cy="76" rx="3.5" ry="5" fill="#3f2859" />
            <ellipse cx="82" cy="76" rx="3.5" ry="5" fill="#3f2859" />
            <path d="M58 90q8 8 16 0" stroke="#3f2859" strokeWidth="3" strokeLinecap="round" />
          </g>
          <Star x={70} y={67} size={13} color="#755394" />
          <Star x={288} y={132} size={20} color="#f7f0ff" />
          <path
            d="m276 42 5 10m-20-2 9 6m-14 9 11 1"
            stroke="#755394"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="77" cy="142" r="5" stroke="#ab8ccb" strokeWidth="2" />
        </>
      )}
      {kind === 'space' && (
        <>
          <circle cx="192" cy="95" r="64" fill="#efb098" opacity=".4" />
          <g transform="rotate(-24 183 92)">
            <circle cx="183" cy="92" r="51" fill="#e8a06f" />
            <path
              d="M140 70q47 29 88 0m-96 26q46 27 101 0m-85 30q33 13 71-1"
              stroke="#ce815a"
              strokeWidth="9"
              opacity=".6"
            />
            <ellipse cx="183" cy="96" rx="93" ry="21" stroke="#936cae" strokeWidth="14" />
            <path
              d="M98 90c-15 23 151 55 178 4"
              stroke="#bca0d1"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>
          <Star x={68} y={45} size={12} color="#997094" />
          <Star x={286} y={57} size={9} color="#fff7e7" />
          <Star x={274} y={150} size={14} color="#997094" />
          <circle cx="76" cy="137" r="7" fill="#fef5e8" />
          <circle cx="301" cy="95" r="3" fill="#ac7c72" />
        </>
      )}
      {kind === 'world' && (
        <>
          <path
            d="M57 139c22-20 52-27 76-25m99-53c22-22 53-21 69-9"
            stroke="#80a7b5"
            strokeWidth="2"
            strokeDasharray="5 6"
          />
          <circle cx="181" cy="94" r="65" fill="#78b7cd" stroke="#568b9f" strokeWidth="2" />
          <path
            d="m144 41 14 8 3 16 17 7-7 16-19 3-4 20-12 4-12-20-8-5a65 65 0 0 1 28-49m49-11 6 18 19 6 10 17-5 16 15 9 7-6a65 65 0 0 0-52-60m-14 71 22-7 18 14-6 20-16 5-4 23-12-3-3-21-10-12z"
            fill="#d3e6ab"
          />
          <ellipse cx="181" cy="94" rx="31" ry="65" stroke="#507e8e" opacity=".4" />
          <path d="M117 94h128m-119-33h109m-109 66h109" stroke="#507e8e" opacity=".4" />
          <g transform="translate(251 38) rotate(16)">
            <path d="m0 12 36-12-13 31-6-12z" fill="#fffaf0" stroke="#688d9b" strokeWidth="2" />
            <path d="m17 19 19-19" stroke="#688d9b" strokeWidth="2" />
          </g>
          <Star x={74} y={71} size={9} color="#5c8797" />
          <Star x={278} y={139} size={13} color="#fffaf0" />
          <circle cx="93" cy="160" r="4" fill="#79a4b4" />
        </>
      )}
      {kind === 'science' && (
        <>
          <circle cx="180" cy="95" r="72" fill="#b1d9c9" opacity=".5" />
          <g transform="rotate(12 184 100)">
            <path
              d="M166 34h36m-32 0v46l-39 64a10 10 0 0 0 9 15h90a10 10 0 0 0 8-15l-39-64V34"
              fill="#e9f6ed"
              stroke="#447c69"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="m150 119-17 28a7 7 0 0 0 6 9h90a7 7 0 0 0 6-9l-20-33c-23 14-43-8-65 5Z"
              fill="#77b495"
            />
            <circle cx="173" cy="137" r="6" fill="#c9eccc" />
            <circle cx="203" cy="143" r="4" fill="#c9eccc" />
            <circle cx="186" cy="100" r="5" stroke="#77b495" strokeWidth="2" />
          </g>
          <circle cx="155" cy="30" r="7" stroke="#59957b" strokeWidth="2" />
          <circle cx="176" cy="13" r="4" fill="#77b495" />
          <Star x={268} y={58} size={13} color="#508b73" />
          <Star x={79} y={132} size={16} color="#f3f9df" />
          <path d="M90 48v14m-7-7h14" stroke="#508b73" strokeWidth="2" />
        </>
      )}
      {kind === 'art' && (
        <>
          <circle cx="185" cy="93" r="72" fill="#e9b7c5" opacity=".45" />
          <path
            d="M191 30c-52-10-93 24-87 68 6 49 52 70 79 57 22-10-2-28 12-35 11-6 19 15 35 8 34-15 12-88-39-98Z"
            fill="#fff0d2"
            stroke="#b67c79"
            strokeWidth="2.5"
          />
          <ellipse cx="186" cy="57" rx="13" ry="10" fill="#ad86c0" transform="rotate(17 186 57)" />
          <circle cx="145" cy="65" r="12" fill="#d77a7c" />
          <circle cx="130" cy="102" r="12" fill="#e1b55f" />
          <circle cx="155" cy="134" r="12" fill="#8bb9a8" />
          <ellipse cx="217" cy="87" rx="10" ry="13" fill="#91b5cd" transform="rotate(-25 217 87)" />
          <ellipse cx="178" cy="99" rx="10" ry="13" fill="#edced7" transform="rotate(-25 178 99)" />
          <g transform="rotate(33 244 99)">
            <path d="M239 66h10l-2 94a3 3 0 0 1-6 0z" fill="#7e626e" />
            <path d="M239 66V52h10v14" fill="#bdaf9b" />
            <path d="M239 52c-8-10-2-25 5-32-2 17 17 20 5 32" fill="#b4869c" />
          </g>
          <Star x={79} y={55} size={12} color="#ab758b" />
          <Star x={288} y={134} size={15} color="#fff3dd" />
        </>
      )}
      {kind === 'history' && (
        <>
          <circle cx="181" cy="98" r="71" fill="#e8cf96" opacity=".45" />
          <g transform="rotate(-5 179 92)">
            <path
              d="M139 32h83v14c0 20-19 33-35 47 16 15 35 28 35 49v12h-83v-12c0-21 19-34 35-49-16-14-35-27-35-47Z"
              fill="#fff7df"
              stroke="#a0834e"
              strokeWidth="3"
            />
            <path
              d="M149 59h63c-6 12-20 22-31 31-12-10-27-21-32-31Zm-1 82c6-15 26-21 33-36 6 15 27 21 33 36Z"
              fill="#d9ac55"
            />
            <path d="M181 93v12" stroke="#d9ac55" strokeWidth="3" />
            <rect x="128" y="23" width="106" height="13" rx="5" fill="#987e61" />
            <rect x="128" y="151" width="106" height="13" rx="5" fill="#987e61" />
          </g>
          <Star x={81} y={65} size={14} color="#bc9758" />
          <Star x={279} y={126} size={18} color="#fffbdf" />
          <path d="m264 46 8-5m-6 17 10 1" stroke="#b6975b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="93" cy="143" r="6" stroke="#c1a570" strokeWidth="2" />
        </>
      )}
    </svg>
  )
}

export function HeroArtwork() {
  return (
    <div className="hero-art" aria-hidden="true">
      <svg viewBox="0 0 350 290" fill="none">
        <ellipse cx="190" cy="247" rx="116" ry="15" fill="#91b54d" opacity=".12" />
        <path
          d="M77 198C-11 103 94 26 207 68s147 168 44 161"
          stroke="#87a552"
          strokeWidth="1.6"
          strokeDasharray="5 6"
        />
        <g transform="rotate(13 223 115)">
          <rect x="145" y="45" width="143" height="163" rx="22" fill="#9680bc" />
          <rect
            x="140"
            y="39"
            width="143"
            height="163"
            rx="22"
            fill="#b4a0d2"
            stroke="#7f699e"
            strokeWidth="1.5"
          />
          <path
            d="m226 63-41 57h27l-12 40 44-56h-28Z"
            fill="#fff7d8"
            stroke="#7f699e"
            strokeWidth="2"
          />
          <rect x="161" y="176" width="72" height="7" rx="3.5" fill="#e1d4ee" />
        </g>
        <g transform="rotate(-14 128 174)">
          <rect x="64" y="105" width="139" height="144" rx="22" fill="#d3a07c" />
          <rect
            x="59"
            y="100"
            width="139"
            height="144"
            rx="22"
            fill="#f2c5a2"
            stroke="#b89472"
            strokeWidth="1.5"
          />
          <path
            d="m127 119 12 21 24-3-7 23 17 17-23 8-5 24-21-12-22 12-3-24-22-9 17-16-7-24 24 4Z"
            fill="#fdf4cf"
            stroke="#ac8d64"
            strokeWidth="1.5"
          />
          <ellipse cx="117" cy="164" rx="3" ry="5" fill="#66583e" />
          <ellipse cx="137" cy="164" rx="3" ry="5" fill="#66583e" />
          <path d="M119 178q8 8 16-1" stroke="#66583e" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <Star x={70} y={58} size={16} color="#607b3b" />
        <Star x={296} y={212} size={19} color="#607b3b" />
        <Star x={302} y={43} size={8} color="#93a958" />
        <circle cx="48" cy="199" r="8" fill="#92ad58" />
        <path d="m123 26 3 12m-13-7 8 9" stroke="#829748" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="art-sticker">A little curious. A lot of fun.</span>
    </div>
  )
}
