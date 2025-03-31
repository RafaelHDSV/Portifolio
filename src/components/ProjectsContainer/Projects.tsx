import { FaGithub } from 'react-icons/fa'
import { LanguagesContainer } from './components/LanguagesContainer'
import { LinksContainer } from './components/LinksContainer'
import { ProjectsData } from '../../constants/ProjectsData'
import styles from './Project.module.scss'

export const ProjectsContainer = () => {
  return (
    <div id='projects' className={`${styles.mainContainer} ${styles.projects}`}>
      <h2 className={styles.titleContainer}>Projetos</h2>

      <div className={styles.projectsContainer}>
        {ProjectsData.map(project => (
          <div className={styles.projectCard} key={project.key}>
            <img src={project.image} alt={project.name} />

            <div className={styles.textContent}>
              <h2>{project.name}</h2>

              <LanguagesContainer key={project.key} languages={project.languages} />

              <article>{project.description}</article>

              <LinksContainer urlProject={project.urlProject} urlGitHub={project.urlGitHub} />
            </div>
          </div>
        ))}
      </div>

      <a className={styles.btnGithub} href='https://github.com/RafaelHDSV?tab=repositories' target='_blank' rel='noreferrer'>
        <FaGithub />
        Ver mais projetos
      </a>
    </div>
  )
}
