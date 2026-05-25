import { ArrowDownIcon, RocketLaunchIcon } from '@phosphor-icons/react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import Typewriter from 'typewriter-effect'
import Button from '../../components/Button/Button'
import { CV_DOWNLOAD_NAME, CV_URL } from '../../constants/cv'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import { useVieiraModeFromUrl } from '../../hooks/useSpaceModeFromUrl'
import styles from './Header.module.scss'

export default function Header () {
  const { t } = useTranslation()
  const { incrementArrowClick, arrowTravelActive } = useEasterEgg()
  const vieiraMode = useVieiraModeFromUrl()

  const typewriterStrings = t('hero.typewriter', {
    returnObjects: true
  }) as string[]

  return (
    <Fade triggerOnce>
      <header
        id='home'
        className={`${styles.header} ${vieiraMode ? styles.vieiraMode : ''}`}
      >
        <div className={styles.fxLayer} aria-hidden='true' />
        <div className={styles.orbA} aria-hidden='true' />
        <div className={styles.orbB} aria-hidden='true' />

        {arrowTravelActive && (
          <RocketLaunchIcon
            className={styles.flyingArrow}
            size='1.75rem'
            weight='fill'
            aria-hidden='true'
          />
        )}

        <div className={styles.content}>
          <h1 className={styles.name}>Rafael Vieira</h1>

          <Typewriter
            options={{
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 30,
              skipAddStyles: true,
              wrapperClassName: styles.typewriter,
              strings: typewriterStrings
            }}
          />

          <div className={styles.ctas}>
            <Button href='#projects' variant='primary'>
              {t('hero.ctaProjects')}
            </Button>
            <Button
              href={CV_URL}
              variant='secondary'
              download={CV_DOWNLOAD_NAME}
            >
              {t('hero.ctaCv')}
            </Button>
          </div>
        </div>

        <button
          type='button'
          className={styles.arrowBtn}
          aria-label={t('hero.arrowHint')}
          onClick={incrementArrowClick}
        >
          <ArrowDownIcon className={styles.arrowDown} size='1.5rem' weight='bold' />
        </button>
      </header>
    </Fade>
  )
}
