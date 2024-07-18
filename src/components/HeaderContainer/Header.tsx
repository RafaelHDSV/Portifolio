// biblioteca para auto escrever títulos
import Typewriter from 'typewriter-effect';

// uso da biblioteca react-icons para utilizar icones externo
import { FaArrowDownLong } from 'react-icons/fa6';

import './Header.scss';

export const HeaderContainer = () => {
	return (
		<div className='header-container'>
			<nav>
				<a href='/'>
					<h2>RV</h2>
				</a>

				<div className='options-nav'>
					<a href='#about'>Sobre</a>
					<a href='#languages'>Linguagens</a>
					<a href='#projects'>Projetos</a>
					<a href='#contact'>Contato</a>
				</div>
			</nav>

			<h1>Rafael Vieira</h1>

			<Typewriter
				options={{
					autoStart: true,
					loop: true,
					delay: 60,
					deleteSpeed: 30,
					strings: [
						'Desenvolvedor Front-End',
						'React | Sass | Typescript | Javascript',
						'Desenvolvedor Web',
						'Front End Developer',
						'Web Developer',
					],
				}}
			/>

			<FaArrowDownLong className='arrow-down' size='2rem' />
		</div>
	);
};
