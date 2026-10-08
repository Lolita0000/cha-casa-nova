import type { Gift } from '@/types/gift'

/**
 * The gift list.
 *
 * These entries are examples to preview the layout: replace them with the
 * real items. Amounts are in cents (R$ 180,00 = 18000).
 */
export const gifts: Gift[] = [
  {
    id: 'cookware-set',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Jogo de panelas',
    description: 'Item de exemplo. Troque pelo que vocês quiserem.',
    priceInCents: 18000,
    productUrl: 'https://www.exemplo.com.br/jogo-de-panelas',
  },
  {
    id: 'blender',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Liquidificador',
    priceInCents: 15000,
  },
  {
    id: 'glasses',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Jogo de copos',
    priceInCents: 6000,
  },
  {
    id: 'fridge',
    kind: 'pooled',
    roomId: 'kitchen',
    name: 'Geladeira',
    description: 'Item de exemplo de cota. A barra mostra quanto já juntamos.',
    goalInCents: 350000,
    raisedInCents: 120000,
    suggestedSharesInCents: [5000, 10000, 20000],
    productUrl: 'https://www.exemplo.com.br/geladeira',
  },
  {
    id: 'rug',
    kind: 'simple',
    roomId: 'living-room',
    name: 'Tapete',
    priceInCents: 25000,
  },
  {
    id: 'sofa',
    kind: 'pooled',
    roomId: 'living-room',
    name: 'Sofá',
    goalInCents: 280000,
    raisedInCents: 0,
    suggestedSharesInCents: [5000, 10000, 20000],
  },
  {
    id: 'bed-linen',
    kind: 'simple',
    roomId: 'bedroom',
    name: 'Jogo de cama',
    priceInCents: 22000,
  },
  {
    id: 'towels',
    kind: 'simple',
    roomId: 'bathroom',
    name: 'Kit de toalhas',
    priceInCents: 12000,
  },
  {
    id: 'washing-machine',
    kind: 'pooled',
    roomId: 'laundry',
    name: 'Máquina de lavar',
    description: 'Item de exemplo já reservado por alguém.',
    goalInCents: 300000,
    raisedInCents: 0,
    suggestedSharesInCents: [5000, 10000, 20000],
    reservedBy: 'Tia Fulana',
  },
]
