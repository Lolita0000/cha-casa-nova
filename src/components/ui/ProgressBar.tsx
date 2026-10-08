interface ProgressBarProps {
  /** Between 0 and 1. */
  value: number
  label: string
  className?: string
}

export function ProgressBar({ value, label, className = '' }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={`h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-rose-200 ${className}`}
    >
      <div
        className="h-full rounded-full bg-rose-400 transition-[width] duration-700 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
