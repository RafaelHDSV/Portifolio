import { CompassIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './SectionTourHint.module.scss'

export default function SectionTourHint () {
  const { t } = useTranslation()
  const {
    sectionTourVisitedCount,
    sectionTourTotal,
    sectionTourProgress,
    isUnlocked
  } = useEasterEgg()

  if (isUnlocked('section-tour')) return null
  if (sectionTourVisitedCount === 0) return null

  return (
    <div
      className={styles.hint}
      role='status'
      aria-live='polite'
      style={{ '--tour-progress': `${sectionTourProgress * 100}%` } as React.CSSProperties}
    >
      <CompassIcon size={18} weight='duotone' aria-hidden='true' />
      <span>
        {t('easterEgg.sectionTourHint', {
          visited: sectionTourVisitedCount,
          total: sectionTourTotal
        })}
      </span>
    </div>
  )
}
