import {
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  WhatsappLogoIcon
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import styles from './Contact.module.scss'

export default function Contact() {
  return (
    <Fade>
      <ContactContent />
    </Fade>
  )
}

function ContactContent() {
  return (
    <div id='contact' className={`mainContainer ${styles.contact}`}>
      <h2 className='titleContainer'>Contato</h2>

      <main>
        <ContactItem
          name='Email'
          focusedName='rafaelvieira1720@gmail.com'
          link='mailto:rafaelvieira1720@gmail.com'
          Icon={EnvelopeIcon}
        />

        <ContactItem
          name='Whatsapp'
          focusedName='(11) 94710-0007'
          link='https://wa.me/5511947100007'
          Icon={WhatsappLogoIcon}
        />

        <ContactItem
          name='Github'
          focusedName='/RafaelHDSV'
          link='https://github.com/RafaelHDSV'
          Icon={GithubLogoIcon}
        />

        <ContactItem
          name='LinkedIn'
          focusedName='/in/rafael-vieira1720'
          link='https://www.linkedin.com/in/rafael-vieira1720/'
          Icon={LinkedinLogoIcon}
        />
      </main>
    </div>
  )
}

interface IContactItemProps {
  name: string
  focusedName: string
  link: string
  Icon: React.ElementType
}

function ContactItem({ name, focusedName, link, Icon }: IContactItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={link}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={name}
    >
      <Icon size={42} weight='light' aria-hidden='true' />
      <span>{isHovered ? focusedName : name}</span>
    </a>
  )
}
