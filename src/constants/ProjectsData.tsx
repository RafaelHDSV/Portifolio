// importação das imagens para os projetos do portifólio
import { images } from './images'

// importação das logos das linguagens
import { FaCss3Alt, FaHtml5, FaReact } from 'react-icons/fa'
import { IoLibrary, IoLogoJavascript, IoSettings } from 'react-icons/io5'
import { SiTypescript } from 'react-icons/si'

// array de projetos
export const ProjectsData = [
  // template de um projeto para criar novos projetos futuramente
  // {
  //  key: '',
  // 	name: '',
  // 	image: '',
  // 	description: '',
  // 	languages: [],
  // 	urlProject: '',
  // 	urlGitHub: '',
  // },

  {
    key: '1',
    name: 'Plann.er',
    image: images.planner,
    description:
      'Plann.er é um planejador de viagens desenvolvido durante a NLW Journey da Rocketseat. Esta aplicação permite aos usuários organizar suas viagens de forma eficiente, incluindo a inserção de locais, gerenciamento de convidados e organização de datas e horários.',
    languages: [
      {
        name: 'React',
        logo: <FaReact />
      },
      {
        name: 'Typescript',
        logo: <SiTypescript />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'Bibliotecas',
        logo: <IoLibrary />
      }
    ],
    urlProject: 'https://plann-er-rafael.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Plann.er'
  },

  {
    key: '2',
    name: 'Clone da Netflix',
    image: images.netflixClone,
    description:
      'Este projeto é um clone do Netflix, feito para testar conhecimentos em React. Foi utilizada a API TMDB e diversas funcionalidades foram adicionadas, como: seleção da foto do usuário e armazenamento em localStorage, filtro por filmes e séries ou por todos, opção de ver detalhes mais precisos de cada filme.',
    languages: [
      {
        name: 'React',
        logo: <FaReact />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'API',
        logo: <IoSettings />
      }
    ],
    urlProject: 'https://netflix-clone-rafael.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Netflix-Clone'
  },

  {
    key: '3',
    name: 'Listagem Automática de Produtos',
    image: images.productList,
    description:
      'Este projeto é uma aplicação web desenvolvida com React que permite aos usuários registrar e visualizar uma lista de itens com suas respectivas descrições, valores e disponibilidade.',
    languages: [
      {
        name: 'React',
        logo: <FaReact />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'HTML',
        logo: <FaHtml5 />
      }
    ],
    urlProject: 'https://oak-tecnologia.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Oak-Tecnologia'
  },

  {
    key: '4',
    name: 'Controle Financeiro',
    image: images.financialControl,
    description:
      'Aplicativo de controle financeiro, para agregar valor de entrada e saída com detalhes sobre eles. O app armazena suas informações no banco de dados local, ou seja, se você sair e/ou recarregar a página, seus gastos e ganhos ainda estarão lá.',
    languages: [
      {
        name: 'React',
        logo: <FaReact />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'HTML',
        logo: <FaHtml5 />
      }
    ],
    urlProject: 'https://financial-control-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Financial-Control'
  },

  {
    key: '5',
    name: 'Aplicativo de tarefas',
    image: images.todoApp,
    description:
      'O aplicativo de tarefas clássico com algumas novidades! Este aplicativo inclui uma alternância de tema escuro/claro e reordenação de arrastar e soltar para quem deseja um teste extra.',
    languages: [
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      },
      {
        name: 'Bibliotecas',
        logo: <IoLibrary />
      }
    ],
    urlProject: 'https://todo-app-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Todo-app'
  },

  {
    key: '6',
    name: 'Aplicativo gerador de conselhos',
    image: images.adviceGeneratorApp,
    description:
      'O projeto perfeito se você está aprendendo como interagir com APIs de terceiros. Este desafio usa a API Advice Slip para gerar citações aleatórias de conselhos.',
    languages: [
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      },
      {
        name: 'API',
        logo: <IoSettings />
      }
    ],
    urlProject: 'https://advice-generator-app-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Advice-generator-app'
  },

  {
    key: '7',
    name: 'MARG',
    image: images.roboticHand,
    description:
      'Neste repositório foi feita uma landing page para um projeto de mão robótica, que visa melhorar a vida de quem tem hipertrofia muscular e não consegue abrir a mão.',
    languages: [
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      },
      {
        name: 'Bibliotecas',
        logo: <IoLibrary />
      }
    ],
    urlProject: 'https://marg-tcc.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Robotic-Hand'
  },

  {
    key: '8',
    name: 'Mazzi Fiori Casamentos',
    image: images.mazziFioriCasamentos,
    description:
      'Neste repositório você encontrará uma landing page de uma empresa de casamentos, ou seja, uma empresa que se responsabiliza pela realização completa do casamento, fazendo com que o cliente escolha entre os tipos de casamento e aproveite.',
    languages: [
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      },
      {
        name: 'Bibliotecas',
        logo: <IoLibrary />
      }
    ],
    urlProject: 'https://mazzi-fiori-casamentos.netlify.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Mazzi-Fiori-Casamentos'
  },

  {
    key: '9',
    name: 'Gerador de Senhas',
    image: images.passwordGenerator,
    description: 'Este projeto é ideal para iniciantes em Javascript com um breve conhecimento da linguagem',
    languages: [
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      }
    ],
    urlProject: 'https://password-generator-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Password-Generator'
  },

  {
    key: '10',
    name: 'Aplicativo Calculadora',
    image: images.calculatorApp,
    description:
      'Este aplicativo de calculadora será um ótimo teste especialmente para suas habilidades em CSS e JS. Se você deseja praticar o Grid, este desafio será perfeito para você!',
    languages: [
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      }
    ],
    urlProject: 'https://calculator-app-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Calculator-app'
  },

  {
    key: '11',
    name: 'Landing Page Loopstudios',
    image: images.loopstudiosLandingPage,
    description:
      'Este desafio é perfeito se você deseja testar seus recursos de CSS Grid. Mesmo sem o Grid, este projeto será divertido para ajudá-lo a praticar suas habilidades de layout!',
    languages: [
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      }
    ],
    urlProject: 'https://loopstudios-landing-page-rafael.netlify.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Loopstudios-landing-page'
  },

  {
    key: '12',
    name: 'Landing Page Agência Sunnyside',
    image: images.sunnysideAgencyLandingPage,
    description:
      'Este desafio será um teste perfeito para seu layout e habilidades de resposta. Há um pouquinho de JS para o menu móvel, mas o foco é HTML e CSS.',
    languages: [
      {
        name: 'HTML',
        logo: <FaHtml5 />
      },
      {
        name: 'CSS',
        logo: <FaCss3Alt />
      },
      {
        name: 'Javascript',
        logo: <IoLogoJavascript />
      }
    ],
    urlProject: 'https://sunnyside-agency-landing-page-rafael.netlify.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Sunnyside-agency-landing-page'
  }
]
