import styles from './Logo.module.scss'

interface LogoProps {
  onClick?: () => void
}

export default function Logo ({ onClick }: LogoProps) {
  return (
    <span className={styles.logo} onClick={onClick} role='presentation'>
      RV
    </span>
  )
}
