import { ArrowDownIcon } from '@phosphor-icons/react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import Typewriter from 'typewriter-effect'
import Button from '../../components/Button/Button'
import { CV_DOWNLOAD_NAME, CV_URL } from '../../constants/cv'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './Header.module.scss'

export default function Header () {
  const { t } = useTranslation()
  const { isUnlocked, incrementArrowClick } = useEasterEgg()
  const spaceMode = isUnlocked('space-mode')

  const typewriterStrings = t('hero.typewriter', {
    returnObjects: true
  }) as string[]

  return (
    <Fade triggerOnce>
      <header
        id='home'
        className={`${styles.header} ${spaceMode ? styles.spaceMode : ''}`}
      >
        <div className={styles.fxLayer} aria-hidden='true' />

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

        <a
          href='#about'
          aria-label='Scroll para sobre'
          onClick={incrementArrowClick}
        >
          <ArrowDownIcon className={styles.arrowDown} size='1.5rem' weight='bold' />
        </a>
      </header>
    </Fade>
  )
}
