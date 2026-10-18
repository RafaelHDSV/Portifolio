import { IProjectConfig } from '../types/IProject'
import { images } from './images'

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

/**
 * Lista rapida para ocultar repositorios da listagem sem precisar criar
 * uma entrada completa em projectsConfig. Nome do repo, case-insensitive.
 */
export const FORCE_EXCLUDED_REPO_NAMES: string[] = [
  'cvs',
  'serveruler-redirect',
  'Mario-Game',
  // Demos simples / CRUD legado — não priorizar no perfil atual
  'Oak-Tecnologia',
  'Zip-Code-Finder',
  'Financial-Control',
  'Todo-app',
  'React-Todo',
  'Calculator-app',
  'Mazzi-Fiori-Casamentos'
]

export const projectsConfig: IProjectConfig[] = [
  {
    key: 'li-posts',
    repoName: 'linkedin-posts',
    name: 'LinkedIn Posts',
    image: '',
    description: {
      pt: 'Scraper local de posts públicos do LinkedIn com cache no Supabase e API para consumo no portfólio — sem hospedar o scraper na nuvem.',
      en: 'Local scraper for public LinkedIn posts with Supabase cache and an API for portfolio consumption — without hosting the scraper in the cloud.'
    },
    languages: ['Typescript', 'Node', 'API'],
    urlGitHub: 'https://github.com/RafaelHDSV/linkedin-posts',
    forceInclude: true,
    order: 0
  },
  {
    key: 'booker',
    repoName: 'booker',
    name: 'Booker',
    image: images.booker,
    description: {
      pt: 'Diário privado de leitura: estante, ciclos (lendo/lido/abandonado), desejados, séries e retrospectiva anual — React, Express e Supabase.',
      en: 'Private reading diary: shelf, reading cycles, wishlist, series and year-in-review — React, Express and Supabase.'
    },
    languages: ['Typescript', 'React', 'Node', 'API'],
    urlProject: 'https://booker-vieira.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/booker',
    demoPriority: 'config',
    featured: true,
    order: 1
  },
  {
    key: 'vieira-center',
    repoName: 'vieira-center',
    name: 'Vieira Center',
    image: images.vieiraCenter,
    description: {
      pt: 'Central pessoal de avisos: GitHub, visitas, deploys, Supabase, voz e agentes viram mensagens claras no Discord, no canal certo e na hora certa.',
      en: 'Personal signal hub: GitHub, visits, deploys, Supabase, voice and agents become clear Discord messages in the right channel at the right time.'
    },
    languages: ['Typescript', 'Node', 'API'],
    urlProject: 'https://vieira-center.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/vieira-center',
    demoPriority: 'config',
    featured: true,
    order: 2
  },
  {
    key: 'vieira-analytics',
    repoName: 'PERSONAL-Vieira-Analytics',
    name: 'Vieira Analytics',
    image: images.vieiraAnalytics,
    description: {
      pt: 'Analytics web self-hosted no estilo Vercel Analytics: componente React nos sites, API central e dashboard para acompanhar todos os projetos.',
      en: 'Self-hosted web analytics in the Vercel Analytics style: React component on your sites, a central API and a dashboard across projects.'
    },
    languages: ['Typescript', 'React', 'Node', 'API'],
    urlProject: 'https://vieira-analytics.vercel.app',
    urlGitHub: 'https://github.com/RafaelHDSV/PERSONAL-Vieira-Analytics',
    demoPriority: 'config',
    featured: true,
    order: 3
  },
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
    order: 4
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
    order: 5
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
    forceExclude: true,
    order: 5
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
    forceExclude: true,
    order: 6
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
    forceExclude: true,
    order: 7
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
    order: 8
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
    order: 9
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
    forceExclude: true,
    order: 10
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
    order: 11
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
    forceExclude: true,
    order: 12
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
    order: 13
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
    order: 14
  }
]

export const PROJECT_FILTERS = ['all', 'React', 'Javascript', 'API'] as const
export type ProjectFilter = (typeof PROJECT_FILTERS)[number]
