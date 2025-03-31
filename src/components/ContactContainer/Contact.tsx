import { useState } from 'react'
import { MdEmail } from 'react-icons/md'
import { FaSquareGithub, FaSquareWhatsapp } from 'react-icons/fa6'
import { FaLinkedin } from 'react-icons/fa'
import styles from './Contact.module.scss'

export const ContactContainer = () => {
  const [isMouseOver, setIsMouseOver] = useState<string | null>(null)

  return (
    <div id='contact' className={`${styles.mainContainer} ${styles.contact}`}>
      <h2 className={styles.titleContainer}>Contato</h2>

      <main>
        <a href='mailto:rafaelvieira1720@gmail.com' target='_blank' onMouseOver={() => setIsMouseOver('email')} onMouseLeave={() => setIsMouseOver(null)}>
          <MdEmail size='2.5rem' />
          {isMouseOver === 'email' ? <span>rafaelvieira1720@gmail.com</span> : <span>Email</span>}
        </a>

        <a href='https://wa.me/5511947100007' target='_blank' onMouseOver={() => setIsMouseOver('whatsapp')} onMouseLeave={() => setIsMouseOver(null)}>
          <FaSquareWhatsapp size='2.5rem' />
          {isMouseOver === 'whatsapp' ? <span>(11) 94710-0007</span> : <span>Whatsapp</span>}
        </a>

        <a href='https://github.com/RafaelHDSV' target='_blank' onMouseOver={() => setIsMouseOver('github')} onMouseLeave={() => setIsMouseOver(null)}>
          <FaSquareGithub size='2.5rem' />
          {isMouseOver === 'github' ? <span>/RafaelHDSV</span> : <span>Github</span>}
        </a>

        <a
          href='https://www.linkedin.com/in/rafael-vieira1720/'
          target='_blank'
          onMouseOver={() => setIsMouseOver('linkedin')}
          onMouseLeave={() => setIsMouseOver(null)}
        >
          <FaLinkedin size='2.5rem' />
          {isMouseOver === 'linkedin' ? <span>/in/rafael-vieira1720/</span> : <span>Linkedin</span>}
        </a>
      </main>
    </div>
  )
}
