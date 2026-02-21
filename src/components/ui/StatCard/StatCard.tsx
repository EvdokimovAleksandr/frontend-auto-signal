import { memo, ReactNode } from 'react'
import './StatCard.scss'

interface StatCardProps {
  title: string
  value: ReactNode
  className?: string
}

const StatCard = memo(({ title, value, className = '' }: StatCardProps) => (
  <div className={`stat-card ${className}`.trim()}>
    <h3 className="stat-card__title">{title}</h3>
    <p className="stat-card__value">{value}</p>
  </div>
))

StatCard.displayName = 'StatCard'

export default StatCard
