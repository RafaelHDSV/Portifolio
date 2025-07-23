import { Fade } from 'react-awesome-reveal'
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
import styles from './Languages.module.scss'

export default function Languages() {
  return (
    <Fade>
      <LanguagesContent />
    </Fade>
  )
}

function LanguagesContent() {
  const icons = [
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

  const repeatedIcons = [...icons, ...icons]

  return (
    <div id='languages' className='mainContainer'>
      <main>
        <div className={styles.slider}>
          <div className={styles.slideTrack}>
            {repeatedIcons.map(({ icon, name }, index) => (
              <div key={index} className={styles.slide} aria-label={name}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
