import Logo from '../../assets/logo-completed.png'
import styles from './About.module.scss'

export const AboutContainer = () => {
  return (
    <div id={styles.about} className={styles.mainContainer}>
      <h2 className={styles.titleContainer}>Sobre mim</h2>

      <main>
        <img src={Logo} alt='logo-completed.png' />

        <aside>
          <h1>Rafael Henrique de Sousa Vieira</h1>

          <article>
            Sou desenvolvedor frontend com 4 anos de experiência em desenvolvimento de interfaces e desenvolvimento WEB. Tenho habilidades sólidas em HTML, CSS
            e JavaScript (JS), com especialização em React JS. Apaixonado por criar soluções de Frontend que são não apenas visualmente atraentes, mas também
            funcionais e intuitivas. Meu foco é transformar ideias em experiências digitais dinâmicas e responsivas na WEB. Estou constantemente atualizando
            meus conhecimentos para acompanhar as tendências e tecnologias emergentes, garantindo sempre a entrega de projetos de alta qualidade.
          </article>

          <a className={styles.btnCv} href='cv.pdf' download='Rafael Vieira - Currículo'>
            Baixar CV
          </a>
        </aside>
      </main>
    </div>
  )
}
