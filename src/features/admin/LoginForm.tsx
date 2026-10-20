import { useId, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'

interface LoginFormProps {
  onSignIn: (email: string, password: string) => Promise<string | null>
}

export function LoginForm({ onSignIn }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailId = useId()
  const passwordId = useId()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(await onSignIn(email.trim(), password))
    setIsSubmitting(false)
  }

  const fieldClass =
    'mt-2 h-12 w-full rounded-2xl border-2 border-ash-200 bg-white px-4 text-ink-900 outline-none focus:border-rose-400'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor={emailId} className="font-bold text-ink-900">
          E-mail
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor={passwordId} className="font-bold text-ink-900">
          Senha
        </label>
        <input
          id={passwordId}
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={fieldClass}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
