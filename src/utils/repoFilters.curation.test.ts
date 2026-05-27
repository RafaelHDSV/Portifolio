import { describe, expect, it, vi } from 'vitest'
import { shouldIncludeRepo } from './repoFilters'

vi.mock('../constants/projects.config', () => ({
  projectsConfig: [
    {
      key: '1',
      repoName: 'forced-fork',
      name: 'Forced Fork',
      image: 'https://example.com/a.png',
      description: { pt: 'p', en: 'e' },
      languages: ['React'],
      urlGitHub: 'https://github.com/RafaelHDSV/forced-fork',
      forceInclude: true
    },
    {
      key: '2',
      repoName: 'blocked-pinned',
      name: 'Blocked',
      image: 'https://example.com/b.png',
      description: { pt: 'p', en: 'e' },
      languages: ['React'],
      urlGitHub: 'https://github.com/RafaelHDSV/blocked-pinned',
      forceExclude: true
    },
    {
      key: '3',
      repoName: 'legacy-hidden',
      name: 'Legacy Hidden',
      image: 'https://example.com/c.png',
      description: { pt: 'p', en: 'e' },
      languages: ['React'],
      urlGitHub: 'https://github.com/RafaelHDSV/legacy-hidden',
      hidden: true
    }
  ]
}))

describe('shouldIncludeRepo curation flags', () => {
  it('inclui fork quando forceInclude esta ativo', () => {
    expect(
      shouldIncludeRepo(
        {
          id: 1,
          name: 'forced-fork',
          fork: true,
          html_url: 'https://github.com/RafaelHDSV/forced-fork'
        },
        'RafaelHDSV'
      )
    ).toBe(true)
  })

  it('exclui repo com forceExclude mesmo pinned', () => {
    expect(
      shouldIncludeRepo(
        {
          id: 2,
          name: 'blocked-pinned',
          fork: false,
          html_url: 'https://github.com/RafaelHDSV/blocked-pinned'
        },
        'RafaelHDSV'
      )
    ).toBe(false)
  })

  it('trata hidden como forceExclude', () => {
    expect(
      shouldIncludeRepo(
        {
          id: 3,
          name: 'legacy-hidden',
          fork: false,
          html_url: 'https://github.com/RafaelHDSV/legacy-hidden'
        },
        'RafaelHDSV'
      )
    ).toBe(false)
  })
})
