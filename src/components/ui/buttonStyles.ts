export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ink-800 text-white hover:bg-ink-700 disabled:bg-ash-200 disabled:text-ash-600',
  secondary:
    'border border-ink-800 text-ink-800 hover:bg-ash-50 disabled:border-ash-200 disabled:text-ash-400',
  ghost: 'text-ink-700 underline decoration-rose-400 underline-offset-4 hover:text-ink-900',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
}

export interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/** Shared so links that look like buttons stay consistent. */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonStyleOptions = {}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed'
  const sizing = variant === 'ghost' ? '' : sizeClasses[size]
  return `${base} ${sizing} ${variantClasses[variant]} ${className}`
}
