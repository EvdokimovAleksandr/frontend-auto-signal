import { memo } from 'react'
import './LoadingSpinner.scss'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const LoadingSpinner = memo(({ size = 'md' }: LoadingSpinnerProps) => (
  <div className={`loading-spinner loading-spinner--${size}`} role="status" aria-label="Загрузка">
    <span className="loading-spinner__dot" />
    <span className="loading-spinner__dot" />
    <span className="loading-spinner__dot" />
  </div>
))

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner
