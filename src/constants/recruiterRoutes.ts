export const RECRUITER_PATH = '/recruiter'

export function isRecruiterPath (pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return normalized === RECRUITER_PATH
}

export function navigateToRecruiterPath (): void {
  if (isRecruiterPath(window.location.pathname)) return
  window.history.pushState({}, '', RECRUITER_PATH)
}

export function navigateToHomePath (): void {
  if (window.location.pathname === '/' || window.location.pathname === '') return
  window.history.pushState({}, '', '/')
}

export function replaceWithRecruiterPath (): void {
  if (isRecruiterPath(window.location.pathname)) return
  window.history.replaceState({}, '', RECRUITER_PATH)
}
