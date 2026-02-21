import { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'premium' | 'locked'
  size?: 'small' | 'medium' | 'large'
  clickable?: boolean
  children: ReactNode
}

const Card = ({
  variant = 'default',
  size = 'medium',
  clickable = false,
  children,
  className = '',
  ...props
}: CardProps) => {
  const classNames = [
    styles.card,
    variant !== 'default' && styles[variant],
    size !== 'medium' && styles[size],
    clickable && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  )
}

// Подкомпоненты
Card.Header = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`${styles.header} ${className}`}>{children}</div>
)

Card.Title = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h3 className={`${styles.title} ${className}`}>{children}</h3>
)

Card.Content = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`${styles.content} ${className}`}>{children}</div>
)

Card.Footer = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`${styles.footer} ${className}`}>{children}</div>
)

export default Card

