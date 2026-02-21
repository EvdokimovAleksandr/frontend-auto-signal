import { memo, ReactNode } from 'react'
import './ErrorMessage.scss'

interface ErrorMessageProps {
  message: string | ReactNode
  details?: string
}

const ErrorMessage = memo(({ message, details }: ErrorMessageProps) => (
  <div className="error-message" role="alert">
    <p className="error-message__text">{message}</p>
    {details && <p className="error-message__details">{details}</p>}
  </div>
))

ErrorMessage.displayName = 'ErrorMessage'

export default ErrorMessage
