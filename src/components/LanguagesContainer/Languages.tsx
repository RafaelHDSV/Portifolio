// dados dos projetos
import { LanguagesData } from '../../constants/LanguagesData';

import './Languages.scss';

export const LanguagesContainer = () => {
	return (
		<div id='languages' className='main-container'>
			<h2 className='title-container'>Linguagens e Tecnologias</h2>

			<main>
				<aside className='info'>
					<h3>Language</h3>

					<article>
						Lorem ipsum dolor sit amet consectetur adipisicing
						elit. Pariatur qui eveniet nihil molestias quia
						quo cum debitis sit tempora architecto deserunt,
						expedita aperiam nisi ad impedit inventore quas!
						Ipsam, beatae.
					</article>
				</aside>

				<aside className='languages'>
					{LanguagesData.map((language) => (
						// <p>{language.name}</p>
						<span>{language.logo}</span>
					))}
				</aside>
			</main>
		</div>
	);
};
