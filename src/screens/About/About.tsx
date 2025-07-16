import dayjs from 'dayjs'
import { Bounce, Fade } from 'react-awesome-reveal'
import Tooltip from '../../components/Tooltip/Tooltip'
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
          <Tooltip text='Nome'>
            Nome: {user?.name} ({user?.login})
          </Tooltip>
          <Tooltip text='Trabalhando em'>
            Trabalhando em: {user?.company}
          </Tooltip>
          <Tooltip text='Localização'>Localização: {user?.location}</Tooltip>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Tooltip text='Seguidores'>Seguidores: {user?.followers}</Tooltip>
            <Tooltip text='Seguindo'>Seguindo: {user?.following}</Tooltip>
          </div>
          <Tooltip text='Repositórios Públicos'>
            Repositórios Públicos: {user?.public_repos}
          </Tooltip>
          <Tooltip text='Programando desde'>
            Programando desde: {dayjs(user?.created_at).format('DD/MM/YYYY')}
          </Tooltip>

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
