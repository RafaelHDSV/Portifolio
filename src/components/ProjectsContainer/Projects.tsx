// icones das linguagens
import { FaGithub } from 'react-icons/fa';

// componentss
import { LanguagesContainer } from './components/LanguagesContainer';
import { LinksContainer } from './components/LinksContainer';

// dados dos projetos
import { ProjectsData } from '../../constants/ProjectsData';

import './Project.scss';

export const ProjectsContainer = () => {
	return (
		<div id='projects' className='main-container'>
			<h2 className='title-container'>Projetos</h2>

			<div className='projects-container'>
				{/* transformar os dados para um card do projeto */}
				{ProjectsData.map((project) => (
					<div className='project-card' key={project.key}>
						<img src={project.image} alt={project.name} />

						<div className='text-content'>
							<h2>{project.name}</h2>

							<LanguagesContainer
								key={project.key}
								languages={project.languages}
							/>

							<article>{project.description}</article>

							<LinksContainer
								urlProject={project.urlProject}
								urlGitHub={project.urlGitHub}
							/>
						</div>
					</div>
				))}
			</div>

			<a
				className='btn-github'
				href='https://github.com/RafaelHDSV'
				target='_blank'
				rel='noreferrer'>
				<FaGithub />
				Ver mais projetos
			</a>
		</div>
	);
};
