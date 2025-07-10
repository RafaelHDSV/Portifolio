import { Fade, Slide } from 'react-awesome-reveal'
import { FaArrowDownLong } from 'react-icons/fa6'
import Typewriter from 'typewriter-effect'
import styles from './Header.module.scss'

export default function HeaderContainer() {
  return (
    <Fade>
      <HeaderContent />
    </Fade>
  )
}

function HeaderContent() {
  return (
    <div className={styles.headerContainer}>
      <Slide direction='left' triggerOnce>
        <h1>Rafael Vieira</h1>
      </Slide>

      <Typewriter
        options={{
          autoStart: true,
          loop: true,
          delay: 60,
          deleteSpeed: 30,
          skipAddStyles: true,
          wrapperClassName: styles.typewriter,
          strings: [
            'Desenvolvedor Front-End',
            'React | Sass | Typescript | Javascript',
            'Desenvolvedor Web',
            'Front End Developer',
            'Web Developer'
          ]
        }}
      />

      <FaArrowDownLong className={styles.arrowDown} size='2rem' />
    </div>
  )
}
