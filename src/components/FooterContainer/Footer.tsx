import React from 'react';

import { MdEmail } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import { FaSquareWhatsapp, FaSquareGithub } from 'react-icons/fa6';

import './Footer.css';

export const FooterContainer = () => {
	return (
		<footer>
			<aside className='left'>
				<div className='social-icon'>
					<a href='mailto:rafaelvieira1720@gmail.com'>
						<MdEmail className='social-icon' size='1.5rem' />
					</a>

					<a href='https://wa.me/5511947100007' target='blank'>
						<FaSquareWhatsapp
							className='social-icon'
							size='1.5rem'
						/>
					</a>

					<a href='https://github.com/RafaelHDSV' target='blank'>
						<FaSquareGithub
							className='social-icon'
							size='1.5rem'
						/>
					</a>

					<a
						href='https://www.linkedin.com/in/rafael-vieira1720/'
						target='blank'>
						<FaLinkedin
							className='social-icon'
							size='1.5rem'
						/>
					</a>
				</div>

				<span>&copy; 2024 | Rafael Vieira</span>
			</aside>

			<aside>
				<a href='#about'>Sobre</a>
				<a href='#languages'>Linguagens</a>
				<a href='#projects'>Projetos</a>
				<a href='#contact'>Contatos</a>
			</aside>
		</footer>
	);
};
