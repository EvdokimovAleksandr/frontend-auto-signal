import { memo, ReactNode, useCallback, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import './Modal.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  showCloseButton?: boolean
}

const Modal = memo(({ isOpen, onClose, children, title, showCloseButton = true }: ModalProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
            {showCloseButton && (
              <Button variant="ghost" className="modal-close" onClick={onClose} aria-label="Закрыть">
                ×
              </Button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
})

Modal.displayName = 'Modal'

export default Modal
