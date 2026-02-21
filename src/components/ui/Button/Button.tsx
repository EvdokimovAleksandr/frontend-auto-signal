import { memo, ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
  fullWidth?: boolean
}

const Button = memo(({ variant = 'primary', children, fullWidth, className = '', type = 'button', ...props }: ButtonProps) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    fullWidth ? 'btn--full' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
