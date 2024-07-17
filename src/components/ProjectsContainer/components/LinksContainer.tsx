// icones das linguagens
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

interface ProjectProps {
	urlProject: string;
	urlGitHub: string;
}

export const LinksContainer = (props: ProjectProps) => {
	return (
		<div className='links'>
			{props.urlProject && (
				<a
					href={props.urlProject}
					target='_blank'
					rel='noreferrer'
					className='link-container'>
					<FaExternalLinkAlt />
					<span>Projeto</span>
				</a>
			)}

			{props.urlGitHub && (
				<a
					href={props.urlGitHub}
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
