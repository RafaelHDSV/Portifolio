import React from 'react';
import { useState } from 'react';

// uso da biblioteca react-icons para utilizar icones externo
import { FaArrowUp } from 'react-icons/fa';

// componentes da página
import { HeaderContainer } from './components/HeaderContainer/Header';
import { AboutContainer } from './components/AboutContainer/About';
import { LanguagesContainer } from './components/LanguagesContainer/Languages';
import { ProjectsContainer } from './components/ProjectsContainer/Projects';
import { ContactContainer } from './components/ContactContainer/Contact';
import { FooterContainer } from './components/FooterContainer/Footer';

import './App.css';

export function App() {
	// adicionar o valor do scroll da página
	const [scrollY, setScrollY] = useState(0);

	// quando ocorrer o evento de scroll, atualiza o valor
	window.addEventListener('scroll', () => {
		setScrollY(window.scrollY);
	});

	// estado do carregamento da página
	const [loading, setLoading] = useState(true);

	// Esconde o loader quando a página está totalmente carregada
	window.addEventListener('load', () => {
		setLoading(false);
	});

	return (
		<div className='App'>
			<HeaderContainer></HeaderContainer>
			<AboutContainer></AboutContainer>
			<LanguagesContainer></LanguagesContainer>
			<ProjectsContainer></ProjectsContainer>
			<ContactContainer></ContactContainer>
			<FooterContainer></FooterContainer>

			{/* visibilidade da seta para inicio da página */}
			{scrollY >= 250 && (
				<button
					className='btn-up'
					onClick={() => {
						window.scrollTo(0, 0);
					}}>
					<FaArrowUp className='arrow-up' />
				</button>
			)}

			{
				/* loader da página */
				loading && (
					<div
						className={`loading ${
							loading ? 'visible' : ''
						}`}></div>
				)
			}
		</div>
	);
}
