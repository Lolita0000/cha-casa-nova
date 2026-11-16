interface RsvpClosedNoteProps {
  className?: string
}

/** Shown once presence confirmation is closed. */
export function RsvpClosedNote({ className = '' }: RsvpClosedNoteProps) {
  return (
    <p className={className}>
      As confirmações de presença foram encerradas: já passou da data limite e chegamos ao número
      máximo de pessoas que o salão de festas comporta. Muito obrigado pelo carinho e pela
      compreensão! 💕
    </p>
  )
}
