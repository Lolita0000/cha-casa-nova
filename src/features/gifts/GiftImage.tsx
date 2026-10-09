import { GiftIcon } from '@/components/icons/icons'
import { publicAsset } from '@/lib/assets/publicAsset'

interface GiftImageProps {
  src?: string
  className?: string
  /** Smaller placeholder icon for thumbnails. */
  compact?: boolean
}

/** Product photo, or a knitted placeholder while the real photo isn't set. */
export function GiftImage({ src, className = '', compact = false }: GiftImageProps) {
  if (src) {
    return (
      <img
        src={src.startsWith('http') ? src : publicAsset(src)}
        alt=""
        loading="lazy"
        className={`bg-ash-100 object-cover ${className}`}
      />
    )
  }

  return (
    <div className={`grid place-items-center bg-rose-200 knit ${className}`}>
      <span
        className={`grid place-items-center rounded-full bg-white/80 text-rose-500 ${compact ? 'size-8' : 'size-14'}`}
      >
        <GiftIcon className={compact ? 'size-4' : 'size-7'} />
      </span>
    </div>
  )
}
