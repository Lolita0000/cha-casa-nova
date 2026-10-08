import type { Room } from '@/types/gift'

import { getRoomAnchor } from './roomAnchor'

interface RoomNavProps {
  rooms: Room[]
}

export function RoomNav({ rooms }: RoomNavProps) {
  return (
    <nav
      aria-label="Cômodos"
      className="sticky top-0 z-10 -mx-5 bg-ash-50/90 px-5 py-3 backdrop-blur sm:mx-0 sm:px-0"
    >
      <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto">
        {rooms.map((room) => (
          <li key={room.id} className="shrink-0">
            <a
              href={`#${getRoomAnchor(room.id)}`}
              className="inline-flex h-10 items-center rounded-full border-2 border-ash-200 bg-white px-4 text-sm font-bold text-ink-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
            >
              {room.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
