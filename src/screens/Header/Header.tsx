import { ArrowDownIcon, GithubLogoIcon } from '@phosphor-icons/react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import Typewriter from 'typewriter-effect'
import Button from '../../components/Button/Button'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './Header.module.scss'

export default function Header () {
  const { t } = useTranslation()
  const { incrementPortfolioClick, isUnlocked } = useEasterEgg()
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
        <div className={styles.content}>
          <h1 className={styles.name}>Rafael Vieira</h1>
          <p className={styles.role}>{t('hero.role')}</p>

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
            <Button href='cv.pdf' variant='secondary'>
              {t('hero.ctaCv')}
            </Button>
            <Button
              href='https://github.com/RafaelHDSV'
              variant='ghost'
            >
              <GithubLogoIcon size={18} weight='bold' />
              {t('hero.ctaGithub')}
            </Button>
          </div>

          <p className={styles.role}>
            <span
              className={styles.portfolioTrigger}
              onClick={incrementPortfolioClick}
              role='presentation'
            >
              {t('hero.portfolioWord')}
            </span>
          </p>
        </div>

        <a href='#about' aria-label='Scroll para sobre'>
          <ArrowDownIcon className={styles.arrowDown} size='1.5rem' weight='bold' />
        </a>
      </header>
    </Fade>
  )
}
