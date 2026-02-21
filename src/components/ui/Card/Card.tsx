import { memo, ReactNode } from 'react'
import './Card.scss'

interface CardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
  hover?: boolean
}

const Card = memo(({ children, className = '', as: Component = 'div', hover }: CardProps) => {
  const classNames = ['card', hover ? 'card--hover' : '', className].filter(Boolean).join(' ')
  return <Component className={classNames}>{children}</Component>
})

Card.displayName = 'Card'

export default Card
