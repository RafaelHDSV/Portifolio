import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin, FaWhatsappSquare } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import ContactForm from '../../components/ContactForm/ContactForm'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
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

export default function Contact () {
  const { t } = useTranslation()

  return (
    <Fade triggerOnce>
      <section id='contact' className={`mainContainer ${styles.contact}`}>
        <Container>
          <SectionTitle
            title={t('contact.title')}
            subtitle={t('contact.subtitle')}
          />

          <div className={styles.layout}>
            <div className={styles.socialGrid}>
              {CHANNELS.map(({ name, focusedName, link, Icon }) => (
                <a
                  key={name}
                  href={link}
                  className={styles.socialItem}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={name}
                >
                  <Icon size={32} aria-hidden='true' />
                  <span>{focusedName}</span>
                </a>
              ))}
            </div>

            <ContactForm />

            <p className={styles.closing}>{t('contact.closing')}</p>
          </div>
        </Container>
      </section>
    </Fade>
  )
}
