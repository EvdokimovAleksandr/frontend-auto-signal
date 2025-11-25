import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: ReactNode
  inputSize?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      inputSize = 'medium',
      fullWidth = false,
      required,
      className = '',
      ...props
    },
    ref
  ) => {
    const containerClasses = [
      styles.container,
      inputSize !== 'medium' && styles[inputSize],
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const inputClasses = [styles.input, error && styles.error]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={containerClasses}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input ref={ref} className={inputClasses} required={required} {...props} />
        {error && <span className={styles.errorMessage}>{error}</span>}
        {hint && !error && <span className={styles.hint}>{hint}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

