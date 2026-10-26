import { describe, expect, it } from 'vitest'
import { institucionalView } from './institucionalRoutes'

describe('institucionalView', () => {
  it('keeps the home and recruiter mode on the existing app', () => {
    expect(institucionalView('/')).toBe('app')
    expect(institucionalView('/recruiter')).toBe('app')
    expect(institucionalView('/recruiter/')).toBe('app')
  })

  it('routes legal pages and unknown paths', () => {
    expect(institucionalView('/privacidade')).toBe('privacy')
    expect(institucionalView('/termos/')).toBe('terms')
    expect(institucionalView('/privacy')).toBe('not-found')
    expect(institucionalView('/recruiter/extra')).toBe('not-found')
  })
})
