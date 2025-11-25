import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
}

const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const classNames = [
    styles.button,
    styles[variant],
    size !== 'medium' && styles[size],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '⏳ Загрузка...' : children}
    </button>
  )
}

export default Button

