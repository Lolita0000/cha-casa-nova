import { Footer } from '@/components/layout/Footer'
import { gifts } from '@/data/gifts'
import { rooms } from '@/data/rooms'
import { groupGiftsByRoom } from '@/data/selectors'
import { CartButton } from '@/features/cart/CartButton'
import { CartDialog } from '@/features/cart/CartDialog'
import { CartProvider } from '@/features/cart/CartProvider'
import { FreeContribution } from '@/features/free-contribution/FreeContribution'
import { ContributionDialog } from '@/features/gifts/ContributionDialog'
import { GiftList } from '@/features/gifts/GiftList'
import { useContributionDialog } from '@/features/gifts/useContributionDialog'
import { Hero } from '@/features/hero/Hero'
import { HowItWorks } from '@/features/how-it-works/HowItWorks'
import { MaterialsNote } from '@/features/materials/MaterialsNote'
import { HousePalette } from '@/features/palette/HousePalette'

const giftsByRoom = groupGiftsByRoom(rooms, gifts)

export function App() {
  const contribution = useContributionDialog()

  return (
    <CartProvider gifts={gifts}>
      <Hero />
      <main>
        <HowItWorks />
        <GiftList giftsByRoom={giftsByRoom} onContribute={contribution.open} />
        <FreeContribution />
        <HousePalette />
        <MaterialsNote />
      </main>
      <Footer />

      <ContributionDialog gift={contribution.gift} onClose={contribution.close} />
      <CartDialog />
      <CartButton />
    </CartProvider>
  )
}
