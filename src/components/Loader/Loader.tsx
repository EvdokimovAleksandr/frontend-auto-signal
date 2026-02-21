import styles from './Loader.module.css'

export interface LoaderProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullscreen?: boolean
  inline?: boolean
}

const Loader = ({
  size = 'medium',
  text,
  fullscreen = false,
  inline = false,
}: LoaderProps) => {
  const classNames = [
    styles.container,
    size !== 'medium' && styles[size],
    fullscreen && styles.fullscreen,
    inline && styles.inline,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames}>
      <div className={styles.spinner} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  )
}

export default Loader

