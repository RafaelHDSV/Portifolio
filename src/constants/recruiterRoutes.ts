export const RECRUITER_PATH = '/recruiter'

export function isRecruiterPath (pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return normalized === RECRUITER_PATH
}

export function navigateToRecruiterPath (): void {
  if (isRecruiterPath(window.location.pathname)) return
  window.history.pushState({}, '', RECRUITER_PATH)
}

export function navigateToHomePath (hash: string = window.location.hash): void {
  const target = hash ? `/${hash}` : '/'
  if (window.location.pathname === '/' && window.location.hash === hash) return
  window.history.pushState({}, '', target)
}

export function replaceWithRecruiterPath (): void {
  if (isRecruiterPath(window.location.pathname)) return
  window.history.replaceState({}, '', RECRUITER_PATH)
}
