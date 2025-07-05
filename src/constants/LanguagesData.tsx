import {
  FaBootstrap,
  FaCss3Alt,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaPython,
  FaReact,
  FaSass
} from 'react-icons/fa'
import { IoLogoJavascript } from 'react-icons/io5'
import { SiCplusplus, SiMysql, SiTypescript } from 'react-icons/si'

export const LanguagesData = [
  // template de uma linguagem para criar novos linguagens futuramente
  // {
  // 	id: ,
  // 	name: '',
  // 	logo: ,
  // 	description: '',
  // },

  {
    id: 0,
    name: 'React',
    logo: <FaReact />,
    description:
      'React é uma biblioteca JavaScript de código aberto, amplamente utilizada para a construção de interfaces de usuário, especialmente em aplicações de página única (SPAs). Desenvolvida pelo Facebook, sua arquitetura baseada em componentes permite a criação de interfaces complexas e reutilizáveis, promovendo um desenvolvimento mais eficiente e organizado. React utiliza um conceito chamado de "Virtual DOM", que melhora o desempenho e a experiência do usuário, atualizando apenas os componentes necessários em vez de recarregar toda a página.'
  },

  {
    id: 1,
    name: 'Typescript',
    logo: <SiTypescript />,
    description:
      'TypeScript é um superconjunto de JavaScript que adiciona tipos estáticos à linguagem, desenvolvido pela Microsoft. Ele facilita a manutenção de grandes bases de código ao permitir a detecção de erros em tempo de compilação, em vez de apenas em tempo de execução. Com a adição de interfaces, enumerações e classes, TypeScript ajuda a estruturar melhor o código, promovendo práticas de programação orientada a objetos e melhorando a escalabilidade e a qualidade do software.'
  },

  {
    id: 2,
    name: 'Javascript',
    logo: <IoLogoJavascript />,
    description:
      'JavaScript é uma linguagem de programação essencial para o desenvolvimento web moderno. Ela permite criar conteúdo dinâmico e interativo em páginas web, desde a validação de formulários até a construção de aplicações complexas de front-end e back-end. Utilizada por milhões de desenvolvedores, JavaScript é a base de muitos frameworks e bibliotecas populares, como React, Angular e Vue.js, e é executada diretamente no navegador do usuário, proporcionando experiências interativas e responsivas.'
  },

  {
    id: 3,
    name: 'Sass',
    logo: <FaSass />,
    description:
      'Sass (Syntactically Awesome Stylesheets) é uma extensão de CSS que introduz funcionalidades avançadas como variáveis, aninhamento, mixins e funções. Estas características tornam o CSS mais poderoso e fácil de manter, especialmente em projetos grandes. Com Sass, os desenvolvedores podem escrever estilos de forma mais programática e modular, reutilizando código e aplicando padrões de design consistentes em toda a aplicação.'
  },

  {
    id: 4,
    name: 'CSS',
    logo: <FaCss3Alt />,
    description:
      'CSS (Cascading Style Sheets) é uma linguagem de estilo utilizada para descrever a apresentação de um documento escrito em HTML ou XML. Com CSS, os desenvolvedores podem controlar o layout, cores, fontes e outros aspectos visuais das páginas web, criando interfaces atraentes e responsivas. CSS é essencial para a separação de conteúdo e apresentação, facilitando a manutenção e a atualização de sites, além de melhorar a acessibilidade e a experiência do usuário.'
  },

  {
    id: 5,
    name: 'HTML',
    logo: <FaHtml5 />,
    description:
      'HTML (HyperText Markup Language) é a linguagem padrão de marcação para criar e estruturar páginas web. Ele define a estrutura básica de uma página, permitindo a inclusão de texto, imagens, links, vídeos e outros elementos. Com HTML5, a linguagem evoluiu para suportar recursos multimídia e gráficos avançados sem a necessidade de plugins adicionais, tornando-se fundamental para a construção de aplicações web modernas e interativas.'
  },

  {
    id: 6,
    name: 'Python',
    logo: <FaPython />,
    description:
      'Python é uma linguagem de programação de alto nível, conhecida por sua sintaxe clara e legível. Ampliamente utilizada em diversas áreas, como desenvolvimento web, ciência de dados, automação, inteligência artificial e desenvolvimento de software, Python permite a criação rápida de protótipos e a construção de aplicações robustas. Sua vasta biblioteca padrão e o ecossistema de pacotes de terceiros tornam Python uma escolha popular entre iniciantes e desenvolvedores experientes.'
  },

  {
    id: 7,
    name: 'C++',
    logo: <SiCplusplus />,
    description:
      'C++ é uma linguagem de programação de propósito geral, poderosa e eficiente. Ela é frequentemente utilizada em desenvolvimento de sistemas, jogos, aplicações de alto desempenho e software embarcado. Com suporte a programação orientada a objetos e recursos de baixo nível, como manipulação direta de memória, C++ oferece flexibilidade e controle total sobre o hardware, sendo uma escolha ideal para projetos que exigem alta performance e eficiência.'
  },

  {
    id: 8,
    name: 'SQL',
    logo: <SiMysql />,
    description:
      'SQL (Structured Query Language) é a linguagem padrão para gerenciamento de bancos de dados relacionais. Utilizada para inserir, buscar, atualizar e deletar dados, SQL é fundamental para a administração e manipulação de grandes volumes de informações em sistemas como MySQL, PostgreSQL e SQL Server. Através de consultas complexas e operações transacionais, SQL permite a criação de bases de dados robustas e escaláveis, essenciais para aplicações empresariais e web.'
  },

  {
    id: 9,
    name: 'Bootstrap',
    logo: <FaBootstrap />,
    description:
      'Bootstrap é um framework front-end de código aberto para desenvolvimento web responsivo e móvel. Desenvolvido pelo Twitter, Bootstrap oferece uma coleção de componentes prontos para uso, como botões, formulários, navegações e muito mais. Ele facilita a criação de interfaces consistentes e atraentes, acelerando o processo de desenvolvimento e garantindo compatibilidade entre diferentes navegadores e dispositivos.'
  },

  {
    id: 10,
    name: 'Git',
    logo: <FaGitAlt />,
    description:
      'Git é um sistema de controle de versão distribuído, amplamente utilizado para rastrear mudanças no código-fonte durante o desenvolvimento de software. Criado por Linus Torvalds, Git facilita a colaboração entre desenvolvedores e o gerenciamento de diferentes versões de um projeto. Com recursos como branches, merges e commits, Git permite que equipes trabalhem simultaneamente em várias funcionalidades e corrijam bugs sem interferir no desenvolvimento principal.'
  },

  {
    id: 11,
    name: 'Github',
    logo: <FaGithub />,
    description:
      'GitHub é uma plataforma de hospedagem de código-fonte baseada em Git, que oferece controle de versão, colaboração e funcionalidades de CI/CD. Além de permitir que desenvolvedores compartilhem seus projetos e colaborem com outros, GitHub fornece ferramentas para gerenciamento de projetos, revisão de código, integração contínua e muito mais. Com uma vasta comunidade de usuários, GitHub é um hub central para projetos de código aberto e desenvolvimento colaborativo.'
  }
]
