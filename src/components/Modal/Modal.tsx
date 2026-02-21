import { useEffect, ReactNode } from 'react'
import styles from './Modal.module.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  showCloseButton?: boolean
  children: ReactNode
  footer?: ReactNode
}

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  showCloseButton = true,
  children,
  footer,
}: ModalProps) => {
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
        
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        
        <div className={styles.content}>{children}</div>
        
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )
}

// Специальный компонент для просмотра изображений
export const ImageModal = ({
  isOpen,
  onClose,
  src,
  alt = 'Image',
}: {
  isOpen: boolean
  onClose: () => void
  src: string
  alt?: string
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.imageModal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <img src={src} alt={alt} className={styles.image} />
      </div>
    </div>
  )
}

export default Modal

