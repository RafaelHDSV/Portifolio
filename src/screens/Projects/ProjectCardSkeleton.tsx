import styles from './Project.module.scss'

export default function ProjectCardSkeleton () {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonMedia} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonBadges}>
          <span className={styles.skeletonBadge} />
          <span className={styles.skeletonBadge} />
          <span className={styles.skeletonBadge} />
        </div>
        <div className={styles.skeletonLines}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
        </div>
        <div className={styles.skeletonActions}>
          <span className={styles.skeletonAction} />
          <span className={styles.skeletonAction} />
        </div>
      </div>
    </div>
  )
}
