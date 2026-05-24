import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import {
  FaBootstrap,
  FaCss3Alt,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaPython,
  FaReact,
  FaSass
} from 'react-icons/fa'
import { IoLogoJavascript } from 'react-icons/io5'
import { SiCplusplus, SiMysql, SiTypescript } from 'react-icons/si'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import styles from './Languages.module.scss'

const TECH_ICONS = [
  { icon: <FaReact />, name: 'React' },
  { icon: <SiTypescript />, name: 'TypeScript' },
  { icon: <IoLogoJavascript />, name: 'JavaScript' },
  { icon: <FaSass />, name: 'Sass' },
  { icon: <FaCss3Alt />, name: 'CSS3' },
  { icon: <FaHtml5 />, name: 'HTML5' },
  { icon: <FaPython />, name: 'Python' },
  { icon: <SiCplusplus />, name: 'C++' },
  { icon: <SiMysql />, name: 'MySQL' },
  { icon: <FaBootstrap />, name: 'Bootstrap' },
  { icon: <FaGitAlt />, name: 'Git' },
  { icon: <FaGithub />, name: 'GitHub' }
]

export default function Languages () {
  const { t } = useTranslation()
  const repeated = [...TECH_ICONS, ...TECH_ICONS]

  return (
    <Fade triggerOnce>
      <section
        id='languages'
        className={`mainContainer ${styles.stackSection}`}
      >
        <Container>
          <SectionTitle title={t('stack.title')} subtitle={t('stack.subtitle')} />
        </Container>

        <div className={styles.sliderWrapper}>
          <div className={styles.slider} aria-label={t('stack.title')}>
            {repeated.map(({ icon, name }, index) => (
              <div key={`${name}-${index}`} className={styles.slide}>
                {icon}
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Fade>
  )
}
