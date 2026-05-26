/** Repositorios fixos no modo recrutador (ordem de exibicao). */
export const RECRUITER_FEATURED_REPO_ORDER = [
  'MedIT',
  'Deprecated-Finder',
  'Dev-Shortcuts'
] as const

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

export const RECRUITER_STACK_PRIMARY = ['React', 'TypeScript', 'Node.js'] as const

export const RECRUITER_STACK_SECONDARY = [
  'Next.js',
  'MongoDB',
  'PostgreSQL',
  'Sass',
  'C#',
  'PHP',
  'Tailwind'
] as const

export function normalizeRepoSlug (name: string): string {
  return name.toLowerCase().replace(/[\s_-]+/g, '')
}

export function matchRepoName (repoName: string, target: string): boolean {
  return normalizeRepoSlug(repoName) === normalizeRepoSlug(target)
}
