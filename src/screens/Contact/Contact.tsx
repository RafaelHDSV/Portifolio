import { useState } from 'react'
import { RocketLaunchIcon } from '@phosphor-icons/react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin, FaWhatsappSquare } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Button from '../../components/Button/Button'
import ContactForm from '../../components/ContactForm/ContactForm'
import Container from '../../components/Container/Container'
import Modal from '../../components/Modal/Modal'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './Contact.module.scss'

const CHANNELS = [
  {
    name: 'Email',
    focusedName: 'rafaelvieira1720@gmail.com',
    link: 'mailto:rafaelvieira1720@gmail.com',
    Icon: MdEmail
  },
  {
    name: 'WhatsApp',
    focusedName: '(11) 94710-0007',
    link: 'https://wa.me/5511947100007',
    Icon: FaWhatsappSquare
  },
  {
    name: 'GitHub',
    focusedName: '/RafaelHDSV',
    link: 'https://github.com/RafaelHDSV',
    Icon: FaGithub
  },
  {
    name: 'LinkedIn',
    focusedName: '/in/rafael-vieira1720',
    link: 'https://www.linkedin.com/in/rafael-vieira1720/',
    Icon: FaLinkedin
  }
]

function ContactItem ({
  name,
  focusedName,
  link,
  Icon
}: (typeof CHANNELS)[number]) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={link}
      className={styles.contactCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={name}
    >
      <Icon size={36} aria-hidden='true' />
      <span>{isHovered ? focusedName : name}</span>
    </a>
  )
}

export default function Contact () {
  const { t } = useTranslation()
  const { vieiraLaunchActive } = useEasterEgg()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Fade triggerOnce>
      <section
        id='contact'
        className={`mainContainer ${styles.contact} ${vieiraLaunchActive ? styles.vieiraLaunch : ''}`}
      >
        {vieiraLaunchActive && (
          <div className={styles.launchFx} aria-hidden='true'>
            <RocketLaunchIcon className={styles.launchRocket} size={48} weight='fill' />
            <span className={styles.launchTrail} />
          </div>
        )}
        <Container>
          <SectionTitle
            title={t('contact.title')}
            subtitle={t('contact.subtitle')}
          />

          <div className={styles.layout}>
            <div className={styles.cardsRow}>
              {CHANNELS.map((channel) => (
                <ContactItem key={channel.name} {...channel} />
              ))}
            </div>

            <Button variant='primary' onClick={() => setModalOpen(true)}>
              {t('contact.openForm')}
            </Button>
          </div>
        </Container>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={t('contact.form.title')}
        >
          <ContactForm onSuccess={() => setModalOpen(false)} />
        </Modal>
      </section>
    </Fade>
  )
}
