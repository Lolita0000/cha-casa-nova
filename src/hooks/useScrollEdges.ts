import { useCallback, useEffect, useState, type RefObject } from 'react'

interface ScrollEdges {
  canScrollStart: boolean
  canScrollEnd: boolean
}

/** Tracks whether a horizontally scrolling element has hidden content on either side. */
export function useScrollEdges(ref: RefObject<HTMLElement | null>): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({ canScrollStart: false, canScrollEnd: false })

  const update = useCallback(() => {
    const element = ref.current
    if (!element) return
    // 1px of slack absorbs sub-pixel rounding on high-density screens.
    const maxScroll = element.scrollWidth - element.clientWidth - 1
    setEdges({
      canScrollStart: element.scrollLeft > 1,
      canScrollEnd: element.scrollLeft < maxScroll,
    })
  }, [ref])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)

    return () => {
      element.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [ref, update])

  return edges
}
