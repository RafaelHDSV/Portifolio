import type { IProjectConfig } from '../types/IProject'

/** Repositorios fixos no modo recrutador (ordem de exibicao). */
export const RECRUITER_FEATURED_REPO_ORDER = [
  'MedIT',
  'Deprecated-Finder',
  'Dev-Shortcuts'
] as const

/** Fallback quando o repo nao veio na API (pins/recentes). */
export const RECRUITER_FEATURED_PROJECTS: Record<
  (typeof RECRUITER_FEATURED_REPO_ORDER)[number],
  IProjectConfig
> = {
  MedIT: {
    key: 'rec-medit',
    repoName: 'MedIT',
    name: 'MedIT',
    image: '',
    description: {
      pt: 'Plataforma web full stack para fluxo hospitalar e apoio a triagem clinica (TCC).',
      en: 'Full-stack web platform for hospital workflow and clinical triage support (capstone).'
    },
    languages: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    urlGitHub: 'https://github.com/RafaelHDSV/MedIT',
    forceInclude: true
  },
  'Deprecated-Finder': {
    key: 'rec-deprecated-finder',
    repoName: 'Deprecated-Finder',
    name: 'Deprecated Finder',
    image: '',
    description: {
      pt: 'Ferramenta para localizar APIs e padroes depreciados em bases de codigo.',
      en: 'Tool to locate deprecated APIs and patterns across codebases.'
    },
    languages: ['TypeScript', 'Node.js'],
    urlGitHub: 'https://github.com/RafaelHDSV/Deprecated-Finder',
    forceInclude: true
  },
  'Dev-Shortcuts': {
    key: 'rec-dev-shortcuts',
    repoName: 'Dev-Shortcuts',
    name: 'Dev Shortcuts',
    image: '',
    description: {
      pt: 'Extensao VS Code com atalhos e automacoes para acelerar o fluxo de desenvolvimento.',
      en: 'VS Code extension with shortcuts and automations to speed up development workflow.'
    },
    languages: ['TypeScript'],
    urlGitHub: 'https://github.com/RafaelHDSV/Dev-Shortcuts',
    forceInclude: true
  }
}

export type RecruiterProjectCategory =
  | 'healthtech'
  | 'devTool'
  | 'productivity'

/** Categoria exibida no card do modo recrutador (chave i18n recruiter.projectCategories.*). */
export const RECRUITER_PROJECT_CATEGORY: Record<string, RecruiterProjectCategory> = {
  MedIT: 'healthtech',
  'Deprecated-Finder': 'devTool',
  'Dev-Shortcuts': 'productivity'
}

export const RECRUITER_STACK_PRIMARY = [
  'React',
  'TypeScript',
  'Node.js',
  'MongoDB'
] as const

export const RECRUITER_STACK_SECONDARY = [
  'Sass',
  'C#',
  'PHP',
  'n8n',
  'Git',
  'PostgreSQL'
] as const

export function normalizeRepoSlug (name: string): string {
  return name.toLowerCase().replace(/[\s_-]+/g, '')
}

export function matchRepoName (repoName: string, target: string): boolean {
  return normalizeRepoSlug(repoName) === normalizeRepoSlug(target)
}
