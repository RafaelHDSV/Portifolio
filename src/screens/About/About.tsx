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
  const { user, loading, error } = useGetMe()

  if (!user || error) {
    return error
  }

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  return (
    <div id='about' className={`mainContainer ${styles.about}`}>
      <h2 className='titleContainer'>Sobre mim</h2>

      <div className={styles.booble}></div>
      <div className={styles.booble_2}></div>

      <main>
        <Bounce>
          <img src={user.avatar_url} alt='logo-completed.png' />
        </Bounce>

        <aside>
          <h1>{user?.name}</h1>

          <span>
            Trabalhando atulmente:
            <a href='https://github.com/AGX-Software' target='_blank'>
              {user?.company}
            </a>
          </span>
          <span>📍 {user?.location}</span>
          <span>💻 Bio: {user?.bio}</span>
          <span>Repositórios públicos: {user?.public_repos}</span>
          <span>Seguidores: {user?.followers}</span>
          <span>Seguindo: {user?.following}</span>
          <span>
            📅 Programando desde: {dayjs(user?.created_at).format('DD/MM/YYYY')}
          </span>

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
