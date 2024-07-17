// uso da biblioteca react-icons para utilizar icones externo
import { MdEmail } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import { FaSquareWhatsapp, FaSquareGithub } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';

import Typewriter from 'typewriter-effect';

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
					<a href='#contact'>Contatos</a>
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

			<div className='social'>
				<a href='mailto:rafaelvieira1720@gmail.com'>
					<MdEmail className='social-icon' size='3rem' />
				</a>

				<a href='https://wa.me/5511947100007' target='blank'>
					<FaSquareWhatsapp
						className='social-icon'
						size='2.5rem'
					/>
				</a>

				<a href='https://github.com/RafaelHDSV' target='blank'>
					<FaSquareGithub
						className='social-icon'
						size='2.5rem'
					/>
				</a>

				<a
					href='https://www.linkedin.com/in/rafael-vieira1720/'
					target='blank'>
					<FaLinkedin className='social-icon' size='2.5rem' />
				</a>
			</div>

			<a href='#about'>
				<IoIosArrowDown className='arrow-down' size='2rem' />
			</a>
		</div>
	);
};
