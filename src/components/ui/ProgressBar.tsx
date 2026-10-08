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
      className={`h-4 overflow-hidden rounded-full bg-white p-0.5 ${className}`}
    >
      <div
        className="h-full min-w-3 rounded-full bg-rose-400 knit transition-[width] duration-700 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
