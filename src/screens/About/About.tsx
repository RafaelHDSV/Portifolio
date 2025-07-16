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

  // FIXME: Correct loading
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
          <div className={styles.avatar}>
            <img src={user?.avatar_url} alt='logo-completed.png' />
          </div>
        </Bounce>

        <aside>
          <span>
            Nome: {user?.name} ({user?.login})
          </span>
          <span>Trabalhando em: {user?.company}</span>
          <span>Localização: {user?.location}</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Seguidores: {user?.followers}</span>
            <span>Seguindo: {user?.following}</span>
          </div>
          <p>Repositórios Públicos: {user?.public_repos}</p>
          <p>
            Programando desde: {dayjs(user?.created_at).format('DD/MM/YYYY')}
          </p>

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
