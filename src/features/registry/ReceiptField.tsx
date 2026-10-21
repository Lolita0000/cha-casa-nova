import { useId, useRef } from 'react'

import { RECEIPT_ACCEPT, validateReceipt } from './api'

interface ReceiptFieldProps {
  file: File | null
  onChange: (file: File | null) => void
  error: string | null
  onError: (error: string | null) => void
}

/** Optional Pix receipt: a photo, a screenshot or the PDF the bank app shares. */
export function ReceiptField({ file, onChange, error, onError }: ReceiptFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSelect(selected: File | undefined) {
    if (!selected) return
    const problem = validateReceipt(selected)
    onError(problem)
    onChange(problem ? null : selected)
  }

  function remove() {
    onChange(null)
    onError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <p className="font-bold text-ink-900">
        Comprovante <span className="font-normal text-ash-500">(opcional)</span>
      </p>
      <p className="mt-1 text-sm text-ash-600">
        Manda o print ou o PDF do Pix. Assim a gente confere rapidinho e a barrinha do presente já
        sobe com o seu valor.
      </p>

      {file ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 py-3">
          <span className="min-w-0 truncate text-sm font-semibold text-ink-800">{file.name}</span>
          <button
            type="button"
            onClick={remove}
            className="shrink-0 text-sm font-semibold text-ash-600 underline underline-offset-4 hover:text-rose-700"
          >
            Trocar
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="mt-3 flex h-12 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-rose-300 bg-white text-sm font-bold text-ink-800 transition-colors focus-within:border-rose-500 hover:bg-rose-50"
        >
          Anexar comprovante
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={RECEIPT_ACCEPT}
            onChange={(event) => handleSelect(event.target.files?.[0])}
            className="sr-only"
          />
        </label>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}
    </div>
  )
}
