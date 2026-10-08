import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export function GiftIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1.5" />
      <path d="M5 12.5v6.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-6.5M12 8.5v12" />
      <path d="M12 8.5C10.5 5 7 4.5 7 6.5S10 8.5 12 8.5ZM12 8.5c1.5-3.5 5-4 5-2s-3 2-5 2Z" />
    </svg>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...baseProps} fill="currentColor" stroke="none" {...props}>
      <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
    </svg>
  )
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </svg>
  )
}
