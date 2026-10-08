import type { RoomId } from '@/types/gift'
import { getRoomAnchor } from '@/features/gifts/roomAnchor'

import {
  FLOOR_PLAN_VIEWBOX,
  floorPlanAreas,
  floorPlanDoors,
  type FloorPlanArea,
} from './floorPlanLayout'

interface FloorPlanProps {
  /** Rooms that have gifts. Only these become links. */
  activeRoomIds: RoomId[]
  className?: string
}

export function FloorPlan({ activeRoomIds, className = '' }: FloorPlanProps) {
  const { width, height } = FLOOR_PLAN_VIEWBOX

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="group"
      aria-label="Planta da casa. Clique em um cômodo para ver os presentes dele."
    >
      {floorPlanAreas.map((area) => {
        const isActive = area.roomId !== undefined && activeRoomIds.includes(area.roomId)
        return isActive && area.roomId ? (
          <a
            key={area.key}
            href={`#${getRoomAnchor(area.roomId)}`}
            aria-label={`Ver presentes: ${area.label}`}
            className="group outline-none"
          >
            <AreaShape area={area} interactive />
          </a>
        ) : (
          <AreaShape key={area.key} area={area} />
        )
      })}

      {floorPlanDoors.map((door) => (
        <g
          key={`${door.x}-${door.y}`}
          transform={`translate(${door.x} ${door.y}) rotate(${door.rotation})`}
          aria-hidden="true"
        >
          <rect x={0} y={-3} width={door.radius} height={6} className="fill-ink-800" />
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={door.radius}
            className="stroke-blush-200"
            strokeWidth={1.5}
          />
          <path
            d={`M ${door.radius} 0 A ${door.radius} ${door.radius} 0 0 1 0 ${door.radius}`}
            fill="none"
            className="stroke-blush-200/60"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        </g>
      ))}

      <rect
        x={20}
        y={20}
        width={width - 40}
        height={height - 40}
        fill="none"
        className="stroke-ink-50"
        strokeWidth={4}
        aria-hidden="true"
      />
    </svg>
  )
}

interface AreaShapeProps {
  area: FloorPlanArea
  interactive?: boolean
}

function AreaShape({ area, interactive = false }: AreaShapeProps) {
  const centerX = area.x + area.width / 2
  const centerY = area.y + area.height / 2

  return (
    <g className={interactive ? 'cursor-pointer' : undefined}>
      <rect
        x={area.x}
        y={area.y}
        width={area.width}
        height={area.height}
        className={
          interactive
            ? 'fill-transparent stroke-ink-100 transition-colors duration-200 group-hover:fill-blush-200/15 group-focus-visible:fill-blush-200/25'
            : 'fill-ink-50/[0.03] stroke-ink-100'
        }
        strokeWidth={2}
      />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        className={
          interactive
            ? 'fill-ink-50 text-[11px] font-medium tracking-wide transition-colors group-hover:fill-blush-200 group-focus-visible:fill-blush-200'
            : 'fill-ink-300 text-[10px] italic'
        }
      >
        {area.label}
      </text>
    </g>
  )
}
