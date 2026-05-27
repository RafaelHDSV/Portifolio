import styles from './Logo.module.scss'

export default function Logo () {
  return (
    <span className={styles.logo} role='presentation'>
      <span className={styles.mark} />
    </span>
  )
}
