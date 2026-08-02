import styles from './BuyMeCoffee.module.scss'

/**
 * Floating BMC pill (bottom-right). Not used in recruiter mode / Footer social.
 */
export default function BuyMeCoffee () {
  return (
    <a
      className={styles.link}
      href='https://www.buymeacoffee.com/vieira'
      target='_blank'
      rel='noopener noreferrer'
      aria-label='Buy me a coffee'
    >
      <span className={styles.icon} aria-hidden='true'>
        ☕
      </span>
      <span>Buy me a coffee</span>
    </a>
  )
}
