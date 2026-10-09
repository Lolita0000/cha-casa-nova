import { useEffect, useId, useRef, type ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Thin wrapper around the native <dialog> element, which gives us focus
 * trapping, Escape to close and the top layer for free.
 */
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(34rem,calc(100%-2rem))] overflow-y-auto overscroll-contain rounded-[2rem] bg-white p-0 text-ink-800 shadow-[0_30px_80px_-30px] shadow-ink-900/40 backdrop:bg-ash-700/50 backdrop:backdrop-blur-[2px] open:animate-[dialog-in_200ms_ease-out]"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <h2 id={titleId} className="font-display text-3xl leading-tight text-ink-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-m-1 grid size-10 shrink-0 place-items-center rounded-full bg-ash-100 text-ash-600 hover:bg-rose-100 hover:text-ink-900"
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" fill="none" />
            </svg>
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  )
}
