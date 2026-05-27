import TechIcon from '../TechIcon/TechIcon'
import styles from './Badge.module.scss'

interface BadgeProps {
  name: string
  showIcon?: boolean
  onClick?: () => void
  active?: boolean
  ariaLabel?: string
}

export default function Badge ({
  name,
  showIcon = true,
  onClick,
  active = false,
  ariaLabel
}: BadgeProps) {
  const className = [
    styles.badge,
    onClick ? styles.interactive : '',
    active ? styles.active : ''
  ]
    .filter(Boolean)
    .join(' ')

  if (onClick) {
    return (
      <button
        type='button'
        className={className}
        onClick={onClick}
        aria-label={ariaLabel ?? name}
        aria-pressed={active}
      >
        {showIcon && <TechIcon name={name} />}
        {name}
      </button>
    )
  }

  return (
    <span className={className}>
      {showIcon && <TechIcon name={name} />}
      {name}
    </span>
  )
}
