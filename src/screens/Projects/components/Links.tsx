import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import styles from '../Project.module.scss'

interface ProjectProps {
  urlProject: string
  urlGitHub: string
}

export default function Links({
  urlProject,
  urlGitHub
}: ProjectProps) {
  return (
    <div className={styles.links}>
      {urlProject && (
        <a
          href={urlProject}
          target='_blank'
          rel='noreferrer'
          className={styles.link}
        >
          <FaExternalLinkAlt />
          <span>Projeto</span>
        </a>
      )}

      {urlGitHub && (
        <a
          href={urlGitHub}
          target='_blank'
          rel='noreferrer'
          className={styles.link}
        >
          <FaGithub />
          <span>Github</span>
        </a>
      )}
    </div>
  )
}
