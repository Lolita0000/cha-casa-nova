export type ButtonVariant = 'primary' | 'soft' | 'outline' | 'link'
export type ButtonSize = 'sm' | 'md'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink-800 text-white hover:bg-ink-700 disabled:bg-ash-200 disabled:text-ash-600',
  soft: 'bg-rose-200 text-ink-900 hover:bg-rose-300',
  outline: 'border-2 border-ink-800 text-ink-800 hover:bg-white',
  link: 'text-ink-800 underline decoration-rose-400 decoration-2 underline-offset-4 hover:decoration-rose-500',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6',
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
    'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors disabled:cursor-not-allowed'
  const sizing = variant === 'link' ? 'font-semibold' : sizeClasses[size]
  return `${base} ${sizing} ${variantClasses[variant]} ${className}`
}
