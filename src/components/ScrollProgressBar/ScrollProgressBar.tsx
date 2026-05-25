import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './ScrollProgressBar.module.scss'

export default function ScrollProgressBar () {
  const { scrollProgress } = useEasterEgg()
  const width = `${Math.round(scrollProgress * 100)}%`

  return (
    <div
      className={styles.bar}
      role='progressbar'
      aria-valuenow={Math.round(scrollProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label='Progresso de rolagem da pagina'
    >
      <span className={styles.fill} style={{ width }} />
    </div>
  )
}
