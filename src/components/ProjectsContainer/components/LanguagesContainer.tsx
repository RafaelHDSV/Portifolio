import React from 'react';
import { useState } from 'react';

export const LanguagesContainer = ({ project }) => {
	// visibilidade do nome da linguagem
	const [languageVisible, setLanguageVisible] = useState(null);
	const [keyVisible, setKeyVisible] = useState(null);

	return (
		<div className='languages-container'>
			{project.languages.map((language) => (
				<div className='single-language-container'>
					<span
						className='language'
						key={Math.random()}
						style={{
							color: `var(--${language.name})`,
						}}
						onMouseEnter={() => {
							setLanguageVisible(language.name);

							setKeyVisible(project.key);
						}}
						onMouseLeave={() => {
							setLanguageVisible(null);

							setKeyVisible(null);
						}}>
						{language.logo}
					</span>

					{language.name === languageVisible &&
						project.key === keyVisible && (
							<>
								<span className='triangle'></span>
								<span className={'language-name'}>
									{language.name}
								</span>
							</>
						)}
				</div>
			))}
		</div>
	);
};
