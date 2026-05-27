import styles from './AmbientOrbs.module.scss'

export type AmbientOrbsPreset = 'hero' | 'about' | 'stack' | 'projects'

interface AmbientOrbsProps {
  preset?: AmbientOrbsPreset
  withDots?: boolean
  paused?: boolean
}

export default function AmbientOrbs ({
  preset = 'about',
  withDots = false,
  paused = false
}: AmbientOrbsProps) {
  return (
    <div
      className={`${styles.root} ${styles[preset]} ${paused ? styles.paused : ''}`}
      aria-hidden='true'
    >
      {withDots && <div className={styles.fxLayer} />}
      <div className={styles.mesh} />
      <div className={styles.gridFade} />
      <div className={styles.orbA} />
      <div className={styles.orbB} />
    </div>
  )
}
