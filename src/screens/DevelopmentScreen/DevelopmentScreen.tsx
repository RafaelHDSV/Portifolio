import { XIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import styles from './DevelopmentScreen.module.scss'

interface DevelopmentScreenProps {
  onClose: () => void
}

export default function DevelopmentScreen ({ onClose }: DevelopmentScreenProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.overlay} role='dialog' aria-modal='true'>
      <button
        type='button'
        className={styles.close}
        onClick={onClose}
        aria-label='Fechar'
      >
        <XIcon size={24} weight='bold' />
      </button>

      <div className={styles.backdrop} onClick={onClose} aria-hidden='true' />

      <main className={styles.panel}>
        <div className={styles.errorPage}>
          <img
            className={styles.leftAstronaut}
            src='/astronaut.png'
            alt=''
            aria-hidden='true'
          />
          <img
            className={styles.rightAstronaut}
            src='/astronaut2.svg'
            alt=''
            aria-hidden='true'
          />

          <div className={styles.errorText}>
            <h1>{t('easterEgg.unlocked')}</h1>
            <p>{t('easterEgg.devMessage')}</p>
          </div>
        </div>

        <div className={styles.bg} />
        <div className={styles.starField}>
          <div className={styles.layer} />
        </div>
      </main>
    </div>
  )
}
