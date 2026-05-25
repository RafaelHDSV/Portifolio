/** Repositorios fixos no modo recrutador (ordem de exibicao). */
export const RECRUITER_FEATURED_REPO_ORDER = [
  'MedIT',
  'Deprecated-Finder',
  'Dev-Shortcuts'
] as const

export function normalizeRepoSlug (name: string): string {
  return name.toLowerCase().replace(/[\s_-]+/g, '')
}

export function matchRepoName (repoName: string, target: string): boolean {
  return normalizeRepoSlug(repoName) === normalizeRepoSlug(target)
}
