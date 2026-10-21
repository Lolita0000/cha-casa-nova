import { getReceiptLink } from '@/features/registry/api'

interface ReceiptLinkProps {
  /** Pix receipt in the receipts bucket. */
  path: string | null
  /** Card receipt page from the checkout. */
  url: string | null
}

/** Opens the receipt a guest attached. */
export function ReceiptLink({ path, url }: ReceiptLinkProps) {
  const href = path ? getReceiptLink(path) : url
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-ink-800 hover:bg-rose-100"
    >
      {path ? 'Ver comprovante do Pix' : 'Ver comprovante do cartão'}
    </a>
  )
}
