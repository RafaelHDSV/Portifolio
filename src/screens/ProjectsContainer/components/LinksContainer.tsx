import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import styles from '../Project.module.scss'

interface ProjectProps {
  urlProject: string
  urlGitHub: string
}

export default function LinksContainer({
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
          className={styles.linkContainer}
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
          className={styles.linkContainer}
        >
          <FaGithub />
          <span>Github</span>
        </a>
      )}
    </div>
  )
}
