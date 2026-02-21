import { memo, ReactNode } from 'react'
import './Badge.scss'

export type BadgeVariant = 'premium' | 'admin' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

const Badge = memo(({ variant = 'default', children }: BadgeProps) => (
  <span className={`badge badge--${variant}`}>{children}</span>
))

Badge.displayName = 'Badge'

export default Badge
