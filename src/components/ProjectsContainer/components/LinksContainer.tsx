import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import styles from '../Project.module.scss'

interface ProjectProps {
  urlProject: string
  urlGitHub: string
}

export const LinksContainer = (props: ProjectProps) => {
  return (
    <div className={styles.links}>
      {props.urlProject && (
        <a href={props.urlProject} target='_blank' rel='noreferrer' className={styles.linkContainer}>
          <FaExternalLinkAlt />
          <span>Projeto</span>
        </a>
      )}

      {props.urlGitHub && (
        <a href={props.urlGitHub} target='_blank' rel='noreferrer' className={styles.linkContainer}>
          <FaGithub />
          <span>Github</span>
        </a>
      )}
    </div>
  )
}
