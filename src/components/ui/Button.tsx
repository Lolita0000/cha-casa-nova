import type { ComponentPropsWithoutRef } from 'react'

import { buttonClassName, type ButtonStyleOptions } from './buttonStyles'

type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonStyleOptions

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName({ variant, size, className })} {...props} />
}
