import TechIcon from '../TechIcon/TechIcon'
import styles from './Badge.module.scss'

interface BadgeProps {
  name: string
  showIcon?: boolean
}

export default function Badge ({ name, showIcon = true }: BadgeProps) {
  return (
    <span className={styles.badge}>
      {showIcon && <TechIcon name={name} />}
      {name}
    </span>
  )
}
