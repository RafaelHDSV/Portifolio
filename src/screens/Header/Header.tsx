import { ArrowDownIcon } from '@phosphor-icons/react'
import { Fade, Slide } from 'react-awesome-reveal'
import Typewriter from 'typewriter-effect'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <Fade>
      <HeaderContent />
    </Fade>
  )
}

function HeaderContent() {
  return (
    <div className={styles.header}>
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

      <ArrowDownIcon className={styles.arrowDown} size='2rem' weight='bold' />
    </div>
  )
}
