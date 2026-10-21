import { useState } from 'react'

import { getReceiptLink } from '@/features/registry/api'

interface ReceiptLinkProps {
  /** Pix receipt in the private bucket. */
  path: string | null
  /** Card receipt page from the checkout. */
  url: string | null
}

/** Opens the receipt a guest attached. Stored files get a short lived link on click. */
export function ReceiptLink({ path, url }: ReceiptLinkProps) {
  const [error, setError] = useState<string | null>(null)
  const [isOpening, setIsOpening] = useState(false)
  const className =
    'mt-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-ink-800 hover:bg-rose-100'

  if (url && !path) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className={className}>
        Ver comprovante do cartão
      </a>
    )
  }

  async function open() {
    if (!path) return
    // Opened before the request so the browser doesn't treat it as a pop-up.
    const tab = window.open('', '_blank')
    setIsOpening(true)
    setError(null)
    try {
      const link = await getReceiptLink(path)
      if (tab) tab.location.href = link
      else window.location.href = link
    } catch (caught) {
      tab?.close()
      setError(caught instanceof Error ? caught.message : 'Não deu pra abrir o comprovante.')
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <div>
      <button type="button" onClick={() => void open()} className={className}>
        {isOpening ? 'Abrindo...' : 'Ver comprovante do Pix'}
      </button>
      {error && <p className="mt-2 text-sm font-semibold text-rose-700">{error}</p>}
    </div>
  )
}
