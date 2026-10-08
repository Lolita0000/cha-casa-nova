interface LivingRoomIllustrationProps {
  className?: string
}

/**
 * The living room we are dreaming about, drawn as a round mirror:
 * gray sofa, rose pillows, a knitted pouf and a little side table.
 */
export function LivingRoomIllustration({ className = '' }: LivingRoomIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Desenho de uma sala com sofá cinza, almofadas rosa e um puff de tricô"
    >
      <defs>
        <clipPath id="mirror">
          <circle cx="200" cy="200" r="200" />
        </clipPath>
        <pattern id="stitch" width="10" height="9" patternUnits="userSpaceOnUse">
          <path
            d="M1.5 1.5Q3.2 4.2 5 7.5M8.5 1.5Q6.8 4.2 5 7.5"
            fill="none"
            stroke="#fff"
            strokeOpacity=".35"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </pattern>
      </defs>

      <g clipPath="url(#mirror)">
        {/* Wall and floor */}
        <rect width="400" height="400" className="fill-ash-100" />
        <rect y="300" width="400" height="100" className="fill-wood-200" />
        <ellipse cx="200" cy="345" rx="185" ry="34" className="fill-rose-200" />
        <ellipse cx="200" cy="345" rx="185" ry="34" fill="url(#stitch)" />

        {/* Frames */}
        <rect
          x="105"
          y="62"
          width="66"
          height="80"
          rx="4"
          className="fill-white stroke-wood-400"
          strokeWidth="5"
        />
        <path
          d="M138 120s-16-9.5-16-21a8.8 8.8 0 0 1 16-5.4 8.8 8.8 0 0 1 16 5.4c0 11.5-16 21-16 21Z"
          className="fill-rose-400"
        />
        <rect
          x="192"
          y="48"
          width="56"
          height="70"
          rx="4"
          className="fill-white stroke-ink-800"
          strokeWidth="4"
        />
        <g className="stroke-rose-400" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M220 106V80M220 92l-9-7M220 88l8-8" />
        </g>
        <circle cx="211" cy="84" r="4.5" className="fill-rose-300" />
        <circle cx="228" cy="79" r="4.5" className="fill-rose-300" />
        <circle cx="220" cy="78" r="5" className="fill-rose-400" />

        {/* Sofa */}
        <rect x="62" y="168" width="276" height="96" rx="28" className="fill-ash-500" />
        <rect x="56" y="236" width="288" height="58" rx="18" className="fill-ash-400" />
        <rect x="32" y="200" width="50" height="96" rx="22" className="fill-ash-600" />
        <rect x="318" y="200" width="50" height="96" rx="22" className="fill-ash-600" />
        <rect x="70" y="292" width="10" height="16" rx="3" className="fill-wood-400" />
        <rect x="320" y="292" width="10" height="16" rx="3" className="fill-wood-400" />

        {/* Pillows */}
        <g transform="rotate(-9 128 214)">
          <rect x="94" y="186" width="70" height="58" rx="16" className="fill-rose-300" />
          <rect x="94" y="186" width="70" height="58" rx="16" fill="url(#stitch)" />
        </g>
        <rect x="170" y="182" width="62" height="60" rx="16" className="fill-white" />
        <circle cx="173" cy="185" r="5" className="fill-white stroke-ash-100" strokeWidth="2" />
        <circle cx="229" cy="185" r="5" className="fill-white stroke-ash-100" strokeWidth="2" />
        <g transform="rotate(8 272 214)">
          <rect x="240" y="188" width="64" height="54" rx="16" className="fill-rose-200" />
          <path
            d="M240 200l32 30 32-30M240 230l32-30 32 30"
            className="stroke-white"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Throw blanket over the right arm */}
        <path
          d="M286 236c18-8 40-10 60-2 8 3 10 14 6 30-5 22-6 38-1 52l-24 4c-6-18-6-36-3-54-14 2-28-3-38-8-8-4-8-17 0-22Z"
          className="fill-rose-400"
        />
        <path
          d="M286 236c18-8 40-10 60-2 8 3 10 14 6 30-5 22-6 38-1 52l-24 4c-6-18-6-36-3-54-14 2-28-3-38-8-8-4-8-17 0-22Z"
          fill="url(#stitch)"
        />

        {/* Knitted pouf */}
        <ellipse cx="128" cy="338" rx="58" ry="34" className="fill-rose-400" />
        <ellipse cx="128" cy="338" rx="58" ry="34" fill="url(#stitch)" />
        <ellipse cx="128" cy="322" rx="50" ry="15" className="fill-rose-300" />
        <ellipse cx="128" cy="322" rx="50" ry="15" fill="url(#stitch)" />

        {/* Side table with flowers */}
        <path
          d="M262 318l-8 46M298 318l8 46M280 318v48"
          className="stroke-wood-400"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <ellipse cx="280" cy="316" rx="42" ry="11" className="fill-white" />
        <path d="M268 312c0-14 4-22 12-22s12 8 12 22Z" className="fill-ash-100" />
        <g className="stroke-ash-500" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M280 292v-24M280 286l-12-14M280 284l13-12" />
        </g>
        <circle cx="280" cy="265" r="6" className="fill-rose-300" />
        <circle cx="267" cy="270" r="5.5" className="fill-rose-400" />
        <circle cx="294" cy="270" r="5.5" className="fill-white" />
      </g>
    </svg>
  )
}
