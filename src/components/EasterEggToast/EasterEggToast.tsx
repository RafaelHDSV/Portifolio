import {
  ArrowDownIcon,
  CompassIcon,
  MoonStarsIcon,
  PaletteIcon,
  RocketLaunchIcon,
  SparkleIcon,
  StarIcon
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { EasterEggId } from '../../hooks/useEasterEgg.types'
import styles from './EasterEggToast.module.scss'

export interface EasterEggToastData {
  messageKey: string
  eggId?: EasterEggId
  progress?: number
}

interface EasterEggToastProps {
  toast: EasterEggToastData | null
}

const EGG_ICONS: Partial<Record<EasterEggId, ReactNode>> = {
  'section-tour': <CompassIcon size={28} weight='duotone' />,
  'theme-hunter': <PaletteIcon size={28} weight='duotone' />,
  'arrow-hint': <ArrowDownIcon size={28} weight='duotone' />,
  'space-mode': <MoonStarsIcon size={28} weight='duotone' />,
  'rocket-email': <RocketLaunchIcon size={28} weight='duotone' />,
  konami: <SparkleIcon size={28} weight='duotone' />,
  'logo-clicks': <StarIcon size={28} weight='duotone' />
}

const EGG_TITLE_KEYS: Partial<Record<EasterEggId, string>> = {
  'section-tour': 'easterEgg.catalog.sectionTour.name',
  'theme-hunter': 'easterEgg.catalog.theme.name',
  'arrow-hint': 'easterEgg.catalog.arrow.name',
  'space-mode': 'easterEgg.catalog.space.name',
  'rocket-email': 'easterEgg.catalog.rocket.name',
  konami: 'easterEgg.catalog.konami.name',
  'logo-clicks': 'easterEgg.catalog.logo.name'
}

export default function EasterEggToast ({ toast }: EasterEggToastProps) {
  const { t } = useTranslation()

  if (!toast) return null

  const icon = toast.eggId ? EGG_ICONS[toast.eggId] : (
    <CompassIcon size={28} weight='duotone' />
  )
  const titleKey = toast.eggId
    ? EGG_TITLE_KEYS[toast.eggId] ?? 'easterEgg.explorer'
    : 'easterEgg.explorer'
  const variantClass = toast.eggId ? styles[`variant_${toast.eggId}`] : ''

  return (
    <div
      className={`${styles.toast} ${variantClass}`}
      role='status'
      aria-live='polite'
    >
      <div className={styles.iconWrap}>{icon}</div>
      <div className={styles.body}>
        <strong>{t(titleKey)}</strong>
        <p>{t(toast.messageKey)}</p>
        {toast.progress !== undefined && toast.progress < 1 && (
          <div className={styles.progressTrack} aria-hidden='true'>
            <span
              className={styles.progressFill}
              style={{ width: `${Math.round(toast.progress * 100)}%` }}
            />
          </div>
        )}
      </div>
      <span className={styles.sparkle} aria-hidden='true' />
    </div>
  )
}
