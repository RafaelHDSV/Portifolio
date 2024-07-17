// dados dos projetos
import { useState } from 'react';
import { LanguagesData } from '../../constants/LanguagesData';

import './Languages.scss';

export const LanguagesContainer = () => {
	const [languageActivity, setLanguageActivity] = useState(0);

	return (
		<div id='languages' className='main-container'>
			<h2 className='title-container'>Linguagens e Tecnologias</h2>

			<main>
				<aside className='info'>
					<h3>{LanguagesData[languageActivity].name}</h3>

					<article>
						{LanguagesData[languageActivity].description}
					</article>
				</aside>

				<aside className='languages'>
					<div className='languages-grid'>
						{LanguagesData.map((language) => (
							<span
								className={`languages-logo ${
									language.id === languageActivity
										? 'activity'
										: ''
								}`}
								onClick={() =>
									setLanguageActivity(language.id)
								}>
								{language.logo}
							</span>
						))}
					</div>
				</aside>
			</main>
		</div>
	);
};
