import { buttonClassName } from '@/components/ui/buttonStyles'

interface CardPaymentProps {
  url: string
}

export function CardPayment({ url }: CardPaymentProps) {
  return (
    <div>
      <p className="text-ash-600">
        Abre a página de pagamento segura numa nova aba. Por lá dá pra parcelar no cartão.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={buttonClassName({ className: 'mt-5 w-full' })}
      >
        Pagar com cartão
      </a>
    </div>
  )
}
