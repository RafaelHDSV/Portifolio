import { useState } from 'react';

// icones
import { MdEmail } from 'react-icons/md';
import { FaSquareGithub, FaSquareWhatsapp } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';

import './Contact.scss';

export const ContactContainer = () => {
	// estados de visibilidade para mais informações
	const [email, setEmail] = useState(false);
	const [phone, setPhone] = useState(false);
	const [github, setGithub] = useState(false);
	const [linkedin, setLinkedin] = useState(false);

	return (
		<div id='contact' className='main-container'>
			<h2 className='title-container'>Contato</h2>

			<main>
				<a
					href='mailto:rafaelvieira1720@gmail.com'
					onMouseEnter={() => setEmail(true)}
					onMouseLeave={() => setEmail(false)}>
					<MdEmail size='2.5rem' />

					{!email ? (
						<span>Email</span>
					) : (
						<span>rafaelvieira1720@gmail.com</span>
					)}
				</a>

				<a
					href='https://wa.me/5511947100007'
					target='blank'
					onMouseEnter={() => setPhone(true)}
					onMouseLeave={() => setPhone(false)}>
					<FaSquareWhatsapp size='2.5rem' />

					{!phone ? (
						<span>Whatsapp</span>
					) : (
						<span>+55 11 94710007</span>
					)}
				</a>

				<a
					href='https://github.com/RafaelHDSV'
					target='blank'
					onMouseEnter={() => setGithub(true)}
					onMouseLeave={() => setGithub(false)}>
					<FaSquareGithub size='2.5rem' />

					{!github ? (
						<span>Github</span>
					) : (
						<span>/RafaelHDSV</span>
					)}
				</a>

				<a
					href='https://www.linkedin.com/in/rafael-vieira1720/'
					target='blank'
					onMouseEnter={() => setLinkedin(true)}
					onMouseLeave={() => setLinkedin(false)}>
					<FaLinkedin size='2.5rem' />

					{!linkedin ? (
						<span>Linkedin</span>
					) : (
						<span>/in/rafael-vieira1720/</span>
					)}
				</a>
			</main>
		</div>
	);
};
