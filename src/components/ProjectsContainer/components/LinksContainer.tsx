// icones das linguagens
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

export const LinksContainer = ({ project }) => {
	return (
		<div className='links'>
			{project.urlProject && (
				<a
					href={project.urlProject}
					target='_blank'
					rel='noreferrer'
					className='link-container'>
					<FaExternalLinkAlt />
					<span>Projeto</span>
				</a>
			)}

			{project.urlGitHub && (
				<a
					href={project.urlGitHub}
					target='_blank'
					rel='noreferrer'
					className='link-container'>
					<FaGithub />
					<span>Github</span>
				</a>
			)}
		</div>
	);
};
