import type { RoomId } from '@/types/gift'

export interface FloorPlanArea {
  key: string
  label: string
  /** Areas without a room have no gifts and are drawn as plain decoration. */
  roomId?: RoomId
  x: number
  y: number
  width: number
  height: number
}

export const FLOOR_PLAN_VIEWBOX = { width: 400, height: 300 }

/** A simplified apartment plan. Coordinates are in viewBox units. */
export const floorPlanAreas: FloorPlanArea[] = [
  {
    key: 'living-room',
    roomId: 'living-room',
    label: 'Sala',
    x: 20,
    y: 20,
    width: 200,
    height: 150,
  },
  { key: 'kitchen', roomId: 'kitchen', label: 'Cozinha', x: 220, y: 20, width: 160, height: 110 },
  { key: 'bedroom', roomId: 'bedroom', label: 'Quarto', x: 20, y: 170, width: 200, height: 110 },
  { key: 'bathroom', roomId: 'bathroom', label: 'Banho', x: 220, y: 130, width: 80, height: 150 },
  { key: 'laundry', roomId: 'laundry', label: 'Lavanderia', x: 300, y: 130, width: 80, height: 70 },
  { key: 'balcony', label: 'Varanda', x: 300, y: 200, width: 80, height: 80 },
]

/** Door swings drawn as quarter circles: hinge point, radius and start angle. */
export const floorPlanDoors = [
  { x: 120, y: 170, radius: 26, rotation: 0 },
  { x: 220, y: 60, radius: 22, rotation: 90 },
  { x: 260, y: 130, radius: 20, rotation: 0 },
  { x: 300, y: 150, radius: 18, rotation: 90 },
]
