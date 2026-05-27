import { images } from './images'
import { IProjectConfig } from '../types/IProject'

/**
 * Curadoria hibrida (Issue #31):
 * - forceInclude: inclui repo mesmo se filtro API excluiria; sintetiza card se ausente na API
 * - forceExclude: oculta repo mesmo se pinned/recente (preferir sobre hidden)
 * - hidden: alias legado de forceExclude
 * - demoPriority: 'config' | 'root' | 'readme' — ordem de busca da midia demo no card
 *
 * Exemplo (nao ativo):
 * { repoName: 'MedIT', demoPriority: 'root', forceInclude: true, ... }
 */

export const projectsConfig: IProjectConfig[] = [
  {
    key: '1',
    repoName: 'Plann.er',
    name: 'Plann.er',
    image: images.planner,
    description: {
      pt: 'Planejador de viagens da NLW Journey: locais, convidados, datas e horários organizados em uma interface React.',
      en: 'Travel planner from NLW Journey: organize places, guests, dates and schedules in a React interface.'
    },
    languages: ['React', 'Typescript', 'CSS', 'HTML', 'Bibliotecas'],
    urlProject: 'https://plann-er-rafael.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Plann.er',
    featured: true,
    order: 1
  },
  {
    key: '2',
    repoName: 'Netflix-Clone',
    name: 'Clone da Netflix',
    description: {
      pt: 'Clone da Netflix com API TMDB, perfil de usuário, filtros e detalhes de filmes e séries.',
      en: 'Netflix clone with TMDB API, user profile, filters and movie/series details.'
    },
    image: images.netflixClone,
    languages: ['React', 'Javascript', 'CSS', 'HTML', 'API'],
    urlProject: 'https://netflix-clone-rafael.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Netflix-Clone',
    featured: true,
    order: 2
  },
  {
    key: '3',
    repoName: 'Oak-Tecnologia',
    name: 'Listagem Automatica de Produtos',
    description: {
      pt: 'App React para registrar e visualizar produtos com descrição, valor e disponibilidade.',
      en: 'React app to register and view products with description, price and availability.'
    },
    image: images.productList,
    languages: ['React', 'Javascript', 'CSS', 'HTML'],
    urlProject: 'https://oak-tecnologia.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Oak-Tecnologia',
    featured: true,
    order: 3
  },
  {
    key: '4',
    repoName: 'Financial-Control',
    name: 'Controle Financeiro',
    description: {
      pt: 'Controle de entradas e saídas com persistência local. Dados mantidos após recarregar a página.',
      en: 'Income and expense tracker with local persistence. Data survives page reloads.'
    },
    image: images.financialControl,
    languages: ['React', 'Javascript', 'CSS', 'HTML'],
    urlProject: 'https://financial-control-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Financial-Control',
    featured: true,
    order: 4
  },
  {
    key: '5',
    repoName: 'Todo-app',
    name: 'Aplicativo de tarefas',
    description: {
      pt: 'Todo app com tema claro/escuro e reordenação drag-and-drop para gerenciar tarefas.',
      en: 'Todo app with light/dark theme and drag-and-drop reordering.'
    },
    image: images.todoApp,
    languages: ['HTML', 'CSS', 'Javascript', 'Bibliotecas'],
    urlProject: 'https://todo-app-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Todo-app',
    order: 5
  },
  {
    key: '6',
    repoName: 'Advice-generator-app',
    name: 'Gerador de conselhos',
    description: {
      pt: 'Gerador de conselhos aleatórios consumindo a Advice Slip API com interface responsiva.',
      en: 'Random advice generator using the Advice Slip API with a responsive interface.'
    },
    image: images.adviceGeneratorApp,
    languages: ['HTML', 'CSS', 'Javascript', 'API'],
    urlProject: 'https://advice-generator-app-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Advice-generator-app',
    order: 6
  },
  {
    key: '7',
    repoName: 'Robotic-Hand',
    name: 'MARG',
    description: {
      pt: 'Landing page para projeto de mão robótica voltado a pessoas com hipertrofia muscular.',
      en: 'Landing page for a robotic hand project aimed at people with muscular hypertrophy.'
    },
    image: images.roboticHand,
    languages: ['HTML', 'CSS', 'Javascript', 'Bibliotecas'],
    urlProject: 'https://marg-tcc.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Robotic-Hand',
    order: 7
  },
  {
    key: '8',
    repoName: 'Mazzi-Fiori-Casamentos',
    name: 'Mazzi Fiori Casamentos',
    description: {
      pt: 'Landing page para empresa de casamentos com escolha de pacotes e apresentação de serviços.',
      en: 'Wedding company landing page with package selection and service showcase.'
    },
    image: images.mazziFioriCasamentos,
    languages: ['HTML', 'CSS', 'Javascript', 'Bibliotecas'],
    urlProject: 'https://mazzi-fiori-casamentos.netlify.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Mazzi-Fiori-Casamentos',
    order: 8
  },
  {
    key: '9',
    repoName: 'Password-Generator',
    name: 'Gerador de Senhas',
    description: {
      pt: 'Gerador de senhas seguras com opções de tamanho e caracteres, ideal para iniciantes em JS.',
      en: 'Secure password generator with size and character options, great for JS beginners.'
    },
    image: images.passwordGenerator,
    languages: ['HTML', 'CSS', 'Javascript'],
    urlProject: 'https://password-generator-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Password-Generator',
    order: 9
  },
  {
    key: '10',
    repoName: 'Calculator-app',
    name: 'Calculadora',
    description: {
      pt: 'Calculadora web com layout em CSS Grid e logica em JavaScript puro.',
      en: 'Web calculator with CSS Grid layout and vanilla JavaScript logic.'
    },
    image: images.calculatorApp,
    languages: ['HTML', 'CSS', 'Javascript'],
    urlProject: 'https://calculator-app-rafael.netlify.app/',
    urlGitHub: 'https://github.com/RafaelHDSV/Calculator-app',
    order: 10
  },
  {
    key: '11',
    repoName: 'Loopstudios-landing-page',
    name: 'Loopstudios',
    description: {
      pt: 'Landing page responsiva focada em CSS Grid e layout adaptativo para diferentes telas.',
      en: 'Responsive landing page focused on CSS Grid and adaptive layout.'
    },
    image: images.loopstudiosLandingPage,
    languages: ['HTML', 'CSS', 'Javascript'],
    urlProject: 'https://loopstudios-landing-page-rafael.netlify.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Loopstudios-landing-page',
    order: 11
  },
  {
    key: '12',
    repoName: 'Sunnyside-agency-landing-page',
    name: 'Agência Sunnyside',
    description: {
      pt: 'Landing page de agência criativa com menu mobile e foco em HTML, CSS e responsividade.',
      en: 'Creative agency landing page with mobile menu, focused on HTML, CSS and responsiveness.'
    },
    image: images.sunnysideAgencyLandingPage,
    languages: ['HTML', 'CSS', 'Javascript'],
    urlProject: 'https://sunnyside-agency-landing-page-rafael.netlify.app',
    urlGitHub: 'https://github.com/RafaelHDSV/Sunnyside-agency-landing-page',
    order: 12
  }
]

export const PROJECT_FILTERS = ['all', 'React', 'Javascript', 'API'] as const
export type ProjectFilter = (typeof PROJECT_FILTERS)[number]
