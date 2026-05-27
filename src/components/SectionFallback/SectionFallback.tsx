import { CircleNotchIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import styles from './SectionFallback.module.scss'

interface SectionFallbackProps {
  minHeight?: string
}

export default function SectionFallback ({
  minHeight = '12rem'
}: SectionFallbackProps) {
  const { t } = useTranslation()

  return (
    <div
      className={styles.fallback}
      style={{ ['--section-fallback-min-height' as string]: minHeight }}
      role='status'
      aria-live='polite'
      aria-label={t('common.sectionLoading')}
    >
      <CircleNotchIcon size={28} weight='bold' aria-hidden />
    </div>
  )
}
