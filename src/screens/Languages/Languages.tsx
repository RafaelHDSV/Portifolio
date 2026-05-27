import { Fade } from 'react-awesome-reveal'
import { CursorIcon, RobotIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import {
  FaBootstrap,
  FaCss3Alt,
  FaFigma,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaNode,
  FaPython,
  FaReact,
  FaSass
} from 'react-icons/fa'
import { IoLogoJavascript } from 'react-icons/io5'
import {
  SiCplusplus,
  SiMongodb,
  SiMysql,
  SiN8N,
  SiPhp,
  SiPostman,
  SiSharp,
  SiTypescript,
  SiVercel
} from 'react-icons/si'
import { VscCode } from 'react-icons/vsc'
import AmbientOrbs from '../../components/AmbientOrbs/AmbientOrbs'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import styles from './Languages.module.scss'

const CORE_TECH = [
  { icon: <FaReact />, name: 'React' },
  { icon: <SiTypescript />, name: 'TypeScript' },
  { icon: <IoLogoJavascript />, name: 'JavaScript' },
  { icon: <FaNode />, name: 'Node.js' },
  { icon: <SiMongodb />, name: 'MongoDB' },
  { icon: <SiPhp />, name: 'PHP' },
  { icon: <SiSharp />, name: 'C#' },
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

const AI_TECH = [
  { icon: <CursorIcon size={36} weight='duotone' />, name: 'Cursor' },
  { icon: <RobotIcon size={36} weight='duotone' />, name: 'Copilot / LLMs' },
  { icon: <SiN8N />, name: 'n8n' }
]

const TOOL_TECH = [
  { icon: <VscCode />, name: 'VS Code' },
  { icon: <FaFigma />, name: 'Figma' },
  { icon: <SiPostman />, name: 'Postman' },
  { icon: <SiVercel />, name: 'Vercel' }
]

function TechGrid ({
  items,
  label
}: {
  items: Array<{ icon: React.ReactNode; name: string }>
  label: string
}) {
  return (
    <div className={styles.categoryBlock}>
      <h3 className={styles.categoryTitle}>{label}</h3>
      <div className={styles.grid} aria-label={label}>
        {items.map(({ icon, name }) => (
          <div key={name} className={styles.techItem}>
            <div className={styles.iconWrap}>{icon}</div>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChipGroup ({ title, items }: { title: string; items: string[] }) {
  return (
    <div className={styles.categoryBlock}>
      <h3 className={styles.categoryTitle}>{title}</h3>
      <ul className={styles.chipList}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default function Languages () {
  const { t } = useTranslation()

  const softSkills = t('stack.softSkills', { returnObjects: true }) as string[]

  return (
    <Fade triggerOnce>
      <section
        id='languages'
        className={`mainContainer ${styles.stackSection}`}
      >
        <AmbientOrbs preset='stack' />
        <Container className={styles.sectionContent}>
          <SectionTitle
            title={t('stack.title')}
            subtitle={t('stack.subtitle')}
          />
        </Container>

        <Container className={`${styles.sectionContent} ${styles.categories}`}>
          <TechGrid items={CORE_TECH} label={t('stack.categories.core')} />
          <TechGrid items={AI_TECH} label={t('stack.categories.ai')} />
          <TechGrid items={TOOL_TECH} label={t('stack.categories.tools')} />
          <ChipGroup title={t('stack.categories.softSkills')} items={softSkills} />
        </Container>
      </section>
    </Fade>
  )
}
