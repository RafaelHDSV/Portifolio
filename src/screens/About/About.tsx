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

export default function About() {
  return (
    <Fade>
      <AboutContent />
    </Fade>
  )
}

function AboutContent() {
  const { user, loading } = useGetMe()
  if (loading) return

  return (
    <div id='about' className={`mainContainer ${styles.about}`}>
      <h2 className='titleContainer'>Sobre mim</h2>

      <div className={styles.booble}></div>
      <div className={styles.booble_2}></div>

      <main>
        <Bounce>
          <div className={styles.avatar}>
            <img src={user?.avatar_url} alt='logo-completed.png' />
          </div>
        </Bounce>

        <aside>
          <h2>
            {user?.name} ({user?.login})
          </h2>
          <div className={styles.item}>
            <BuildingOfficeIcon
              className={styles.icon}
              size={22}
              weight='light'
            />
            <span>Trabalhando em:</span>
            <span>{user?.company}</span>
          </div>
          <div className={styles.item}>
            <MapPinIcon className={styles.icon} size={22} weight='light' />
            <span>Localização:</span>
            <span>{user?.location}</span>
          </div>

          <div className='flex space-between'>
            <div className={styles.item}>
              <TrayArrowDownIcon
                className={styles.icon}
                size={22}
                weight='light'
              />
              <span>Seguidores:</span>
              <span>{user?.followers}</span>
            </div>
            <div className={styles.item}>
              <TrayArrowUpIcon
                className={styles.icon}
                size={22}
                weight='light'
              />
              <span>Seguindo:</span>
              <span>{user?.following}</span>
            </div>
          </div>

          <div className={styles.item}>
            <FilesIcon className={styles.icon} size={22} weight='light' />
            <span>Repositórios Públicos:</span>
            <span>{user?.public_repos}</span>
          </div>

          <div className={styles.item}>
            <CalendarDotsIcon
              className={styles.icon}
              size={22}
              weight='light'
            />
            <span>Programando desde:</span>
            <span>{dayjs(user?.created_at).format('DD/MM/YYYY')}</span>
          </div>

          <Bounce>
            <a
              className={styles.btnCv}
              href='cv.pdf'
              download='Rafael Vieira - Currículo'
            >
              Baixar CV
            </a>
          </Bounce>
        </aside>
      </main>
    </div>
  )
}
