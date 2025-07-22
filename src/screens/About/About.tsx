import {
  BuildingOfficeIcon,
  CalendarDotsIcon,
  FilesIcon,
  MapPinIcon,
  TrayArrowDownIcon,
  TrayArrowUpIcon
} from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { Bounce, Fade } from 'react-awesome-reveal'
import useGetMe from '../../hooks/useGetMe'
import styles from './About.module.scss'
import UserInfoItem from './components/UserInfoItem'

export default function About() {
  return (
    <Fade>
      <AboutContent />
    </Fade>
  )
}

function AboutContent() {
  const { user, loading } = useGetMe()
  if (!user || loading) return

  return (
    <div id='about' className={`mainContainer ${styles.about}`}>
      <h2 className='titleContainer'>Sobre mim</h2>

      <div className={styles.booble}></div>
      <div className={styles.booble_2}></div>

      <main>
        <Bounce>
          <div className={styles.avatar}>
            <img
              src={user.avatar_url}
              alt={`Avatar de ${user.name}`}
              loading='lazy'
            />
          </div>
        </Bounce>

        <section>
          <h2>
            {user.name} ({user.login})
          </h2>

          <div className={styles.info}>
            <UserInfoItem
              icon={BuildingOfficeIcon}
              label='Trabalhando em'
              value={user.company}
            />
            <UserInfoItem
              icon={MapPinIcon}
              label='Localização'
              value={user.location}
            />
            <div className='flex space-between'>
              <UserInfoItem
                icon={TrayArrowDownIcon}
                label='Seguidores'
                value={user.followers}
              />
              <UserInfoItem
                icon={TrayArrowUpIcon}
                label='Seguindo'
                value={user.following}
              />
            </div>
            <UserInfoItem
              icon={FilesIcon}
              label='Repositórios Públicos'
              value={user.public_repos}
            />
            <UserInfoItem
              icon={CalendarDotsIcon}
              label='Programando desde'
              value={dayjs(user.created_at).format('DD/MM/YYYY')}
            />
          </div>

          <Bounce>
            <a
              className={styles.btnCv}
              href='cv.pdf'
              download='Rafael Vieira - Currículo'
              rel='noopener noreferrer'
            >
              Baixar CV
            </a>
          </Bounce>
        </section>
      </main>
    </div>
  )
}
