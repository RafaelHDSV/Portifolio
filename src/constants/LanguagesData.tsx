import {
	FaReact,
	FaCss3Alt,
	FaHtml5,
	FaPython,
	FaBootstrap,
	FaGitAlt,
	FaGithub,
} from 'react-icons/fa';

import { IoLogoJavascript } from 'react-icons/io5';
import { SiCplusplus, SiMysql } from 'react-icons/si';

export const LanguagesData = [
	{
		id: 0,
		name: 'React',
		logo: <FaReact />,
		description:
			'Uma biblioteca JavaScript de código aberto para construir interfaces de usuário, mantida pelo Facebook e por uma comunidade de desenvolvedores individuais e empresas.',
	},

	{
		id: 1,
		name: 'Javascript',
		logo: <IoLogoJavascript />,
		description:
			'Uma linguagem de programação essencial para o desenvolvimento web, permitindo criar conteúdo dinâmico e interativo em páginas web. É utilizada tanto no front-end quanto no back-end com frameworks como Node.js.',
	},

	{
		id: 2,
		name: 'CSS',
		logo: <FaCss3Alt />,
		description:
			'Uma linguagem de estilo utilizada para descrever a apresentação de um documento escrito em HTML ou XML. CSS controla o layout, cores, fontes e outros aspectos visuais das páginas web.',
	},

	{
		id: 3,
		name: 'HTML',
		logo: <FaHtml5 />,
		description:
			'A linguagem padrão de marcação para criar e estruturar páginas web. HTML define o conteúdo e a estrutura básica das páginas, permitindo a inclusão de texto, imagens, links, vídeos e outros elementos.',
	},

	{
		id: 4,
		name: 'Python',
		logo: <FaPython />,
		description:
			'Uma linguagem de programação de alto nível, conhecida por sua sintaxe clara e legível. Python é amplamente utilizada em desenvolvimento web, ciência de dados, automação, inteligência artificial e muito mais.',
	},

	{
		id: 5,
		name: 'C++',
		logo: <SiCplusplus />,
		description:
			'Uma linguagem de programação de propósito geral, poderosa e eficiente. C++ é frequentemente utilizada em desenvolvimento de sistemas, jogos, aplicações de alto desempenho e software embarcado.',
	},

	{
		id: 6,
		name: 'SQL',
		logo: <SiMysql />,
		description:
			'Uma linguagem padrão para gerenciamento de bancos de dados relacionais. SQL é utilizada para inserir, buscar, atualizar e deletar dados em bancos de dados como MySQL, PostgreSQL, e SQL Server.',
	},

	{
		id: 7,
		name: 'Bootstrap',
		logo: <FaBootstrap />,
		description:
			'Um framework front-end de código aberto para desenvolvimento web responsivo e móvel. Bootstrap oferece uma coleção de componentes prontos para uso, como botões, formulários, navegações e muito mais.',
	},

	{
		id: 8,
		name: 'Git',
		logo: <FaGitAlt />,
		description:
			'Um sistema de controle de versão distribuído, amplamente utilizado para rastrear mudanças no código-fonte durante o desenvolvimento de software. Git facilita a colaboração entre desenvolvedores e o gerenciamento de diferentes versões de um projeto.',
	},

	{
		id: 9,
		name: 'Github',
		logo: <FaGithub />,
		description:
			'Uma plataforma de hospedagem de código-fonte baseada em Git, que oferece controle de versão, colaboração e funcionalidades de CI/CD. Github permite que desenvolvedores compartilhem seus projetos, colaborem com outros e gerenciem o ciclo de vida do desenvolvimento de software.',
	},
];
