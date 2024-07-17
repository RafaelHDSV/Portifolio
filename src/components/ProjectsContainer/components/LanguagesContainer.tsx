import { useState } from 'react';

interface ProjectProps {
	key: string;
	languages: {
		name: string;
		logo: JSX.Element;
	}[];
}

export const LanguagesContainer = (props: ProjectProps) => {
	// visibilidade do nome da linguagem
	const [languageVisible, setLanguageVisible] = useState<string | null>();
	const [keyVisible, setKeyVisible] = useState<string | null>();

	return (
		<div className='languages-container'>
			{props.languages.map((language) => (
				<div className='single-language-container'>
					<span
						className='language'
						key={Math.random()}
						style={{
							color: `var(--${language.name})`,
						}}
						onMouseEnter={() => {
							setLanguageVisible(language.name);
							setKeyVisible(props.key);
						}}
						onMouseLeave={() => {
							setLanguageVisible(null);
							setKeyVisible(null);
						}}>
						{language.logo}
					</span>

					{language.name === languageVisible &&
						props.key === keyVisible && (
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
