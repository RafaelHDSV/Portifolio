export type InstitucionalView = 'app' | 'privacy' | 'terms' | 'not-found'

/** O portfólio não usa react-router. `/` e `/recruiter` continuam o app. */
export function institucionalView (pathname: string): InstitucionalView {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/' || path === '/recruiter') return 'app'
  if (path === '/privacidade') return 'privacy'
  if (path === '/termos') return 'terms'
  return 'not-found'
}
