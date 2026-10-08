import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

export interface TabItem<T extends string> {
  id: T
  label: string
  content: ReactNode
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[]
  activeId: T
  onChange: (id: T) => void
  label: string
}

/** Accessible tabs following the WAI-ARIA pattern, with arrow key navigation. */
export function Tabs<T extends string>({ tabs, activeId, onChange, label }: TabsProps<T>) {
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!step) return

    event.preventDefault()
    const currentIndex = tabs.findIndex((tab) => tab.id === activeId)
    const next = tabs[(currentIndex + step + tabs.length) % tabs.length]
    onChange(next.id)
    tabRefs.current[next.id]?.focus()
  }

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0]

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="flex gap-1 rounded-full bg-ash-100 p-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={`h-10 flex-1 rounded-full px-3 text-sm font-bold transition-colors ${
                isActive ? 'bg-white text-ink-900 shadow-sm' : 'text-ash-600 hover:text-ink-800'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${activeTab.id}`}
        aria-labelledby={`${baseId}-tab-${activeTab.id}`}
        className="pt-6"
      >
        {activeTab.content}
      </div>
    </div>
  )
}
