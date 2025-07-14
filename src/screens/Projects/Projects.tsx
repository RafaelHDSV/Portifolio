import { Fade } from 'react-awesome-reveal'
import { FaGithub } from 'react-icons/fa'
import { ProjectsData } from '../../constants/ProjectsData'
import LanguagesOptions from './components/LanguagesOptions'
import Links from './components/Links'
import styles from './Project.module.scss'

export default function Projects() {
  return (
    <Fade>
      <ProjectsContent />
    </Fade>
  )
}

function ProjectsContent() {
  // const { repos, loading, error } = useGetRepos()

  // console.log('repos', repos)
  // console.log('loading', loading)
  // console.log('error', error)

  return (
    <>
      {/* {repos.map((repo) => (
        <p>{repo.name}</p>
      ))} */}

      <div
        id='projects'
        className={`mainContainer ${styles.projectsContainer}`}
      >
        <h2 className='titleContainer'>Projetos</h2>

        <div className={styles.projects}>
          {ProjectsData.map((project) => (
            <div key={project.key} className={styles.projectCard}>
              <img src={project.image} alt={project.name} />

              <div className={styles.textContent}>
                <h2>{project.name}</h2>

                <LanguagesOptions
                  projectKey={project.key}
                  languages={project.languages}
                />

                <article>{project.description}</article>

                <Links
                  urlProject={project.urlProject}
                  urlGitHub={project.urlGitHub}
                />
              </div>
            </div>
          ))}
        </div>

        <a
          className={styles.btnGithub}
          href='https://github.com/RafaelHDSV?tab=repositories'
          target='_blank'
          rel='noreferrer'
        >
          <FaGithub />
          Ver mais projetos
        </a>
      </div>
    </>
  )
}
