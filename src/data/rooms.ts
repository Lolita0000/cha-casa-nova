import type { Room } from '@/types/gift'

/** Order here is the order sections appear on the page. */
export const rooms: Room[] = [
  { id: 'kitchen', name: 'Cozinha' },
  { id: 'living-room', name: 'Sala' },
  { id: 'bedroom', name: 'Quarto' },
  { id: 'bathroom', name: 'Banheiro' },
  { id: 'laundry', name: 'Lavanderia' },
  { id: 'renovation', name: 'Reforma' },
  { id: 'aninha', name: 'Aninha' },
  {
    id: 'gabriel',
    name: 'Gabriel',
    emptyMessage: 'O Gabriel ainda está escolhendo os presentes dele.',
  },
]
