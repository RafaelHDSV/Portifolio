import { describe, expect, it } from 'vitest'
import { displayRepoTitle } from './displayRepoTitle'

describe('displayRepoTitle', () => {
  it('remove prefixo PERSONAL-', () => {
    expect(displayRepoTitle('PERSONAL-MedIT')).toBe('MedIT')
    expect(displayRepoTitle('personal-flux')).toBe('flux')
  })

  it('mantem nomes sem o prefixo', () => {
    expect(displayRepoTitle('Plann.er')).toBe('Plann.er')
    expect(displayRepoTitle('PERSONAL')).toBe('PERSONAL')
  })
})
