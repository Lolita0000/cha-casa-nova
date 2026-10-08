import { useId, useState } from 'react'

import { formatCentsShort, reaisToCents } from '@/lib/format/currency'

interface AmountPickerProps {
  options: number[]
  valueInCents: number | undefined
  onChange: (cents: number | undefined) => void
  maxInCents?: number
}

export function AmountPicker({ options, valueInCents, onChange, maxInCents }: AmountPickerProps) {
  const inputId = useId()
  const [customText, setCustomText] = useState('')
  const isCustom = valueInCents !== undefined && !options.includes(valueInCents)

  function parseCustomAmount(text: string): number | undefined {
    const reais = Number(text.replace(',', '.'))
    if (!text || Number.isNaN(reais) || reais <= 0) return undefined
    const cents = reaisToCents(reais)
    return maxInCents ? Math.min(cents, maxInCents) : cents
  }

  function handleCustomChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCustomText(event.target.value)
    onChange(parseCustomAmount(event.target.value))
  }

  return (
    <fieldset>
      <legend className="text-sm text-concrete-600">Quanto você quer dar?</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === valueInCents
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option)}
              className={`h-10 rounded-full border px-4 text-sm font-medium tabular-nums transition-colors ${
                isSelected
                  ? 'border-ink-800 bg-ink-800 text-white'
                  : 'border-concrete-200 text-ink-800 hover:border-ink-500'
              }`}
            >
              {formatCentsShort(option)}
            </button>
          )
        })}

        <label
          htmlFor={inputId}
          className={`flex h-10 items-center gap-1 rounded-full border px-4 text-sm focus-within:border-ink-800 ${
            isCustom ? 'border-ink-800' : 'border-concrete-200'
          }`}
        >
          <span className="text-concrete-600">R$</span>
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            min={1}
            step="any"
            placeholder="outro valor"
            onChange={handleCustomChange}
            value={customText}
            onFocus={() => customText && onChange(parseCustomAmount(customText))}
            className="w-24 bg-transparent tabular-nums outline-none placeholder:text-concrete-400"
          />
        </label>
      </div>
    </fieldset>
  )
}
