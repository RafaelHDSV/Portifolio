import { describe, expect, it, vi } from 'vitest'
import {
  hasHidePortfolioTopic,
  isEligibleNonPinnedRepo,
  shouldIncludePinnedRepo,
  shouldIncludeRepo
} from './repoFilters'

vi.mock('../constants/projects.config', () => ({
  HIDE_PORTFOLIO_TOPIC: 'hide-portfolio',
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
    },
    {
      key: '4',
      repoName: 'force-include-hidden-topic',
      name: 'Force Include Hidden Topic',
      image: 'https://example.com/d.png',
      description: { pt: 'p', en: 'e' },
      languages: ['React'],
      urlGitHub: 'https://github.com/RafaelHDSV/force-include-hidden-topic',
      urlProject: 'https://example.com/demo',
      forceInclude: true
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

  it('exclui repo com topic hide-portfolio', () => {
    expect(
      shouldIncludeRepo(
        {
          id: 5,
          name: 'visible-elsewhere',
          fork: false,
          html_url: 'https://github.com/RafaelHDSV/visible-elsewhere',
          topics: ['react', 'hide-portfolio']
        },
        'RafaelHDSV'
      )
    ).toBe(false)
  })

  it('exclui topic hide-portfolio case-insensitive', () => {
    expect(
      shouldIncludeRepo(
        {
          id: 6,
          name: 'casing-topic',
          fork: false,
          html_url: 'https://github.com/RafaelHDSV/casing-topic',
          topics: ['Hide-Portfolio']
        },
        'RafaelHDSV'
      )
    ).toBe(false)
  })

  it('mantem regras atuais quando o topic hide-portfolio esta ausente', () => {
    expect(
      shouldIncludeRepo(
        {
          id: 7,
          name: 'normal-app',
          fork: false,
          html_url: 'https://github.com/RafaelHDSV/normal-app',
          topics: ['typescript']
        },
        'RafaelHDSV'
      )
    ).toBe(true)
  })

  it('hide-portfolio vence forceInclude', () => {
    expect(
      shouldIncludeRepo(
        {
          id: 8,
          name: 'force-include-hidden-topic',
          fork: false,
          html_url: 'https://github.com/RafaelHDSV/force-include-hidden-topic',
          homepage: 'https://example.com/demo',
          topics: ['hide-portfolio']
        },
        'RafaelHDSV'
      )
    ).toBe(false)
  })
})

describe('hide-portfolio em pinned e elegibilidade', () => {
  it('hasHidePortfolioTopic detecta o topic', () => {
    expect(hasHidePortfolioTopic(['a', 'hide-portfolio'])).toBe(true)
    expect(hasHidePortfolioTopic(['Hide-Portfolio'])).toBe(true)
    expect(hasHidePortfolioTopic(['react'])).toBe(false)
    expect(hasHidePortfolioTopic(undefined)).toBe(false)
  })

  it('exclui pin com hide-portfolio', () => {
    expect(
      shouldIncludePinnedRepo(
        {
          id: 9,
          name: 'pinned-hidden',
          fork: false,
          html_url: 'https://github.com/RafaelHDSV/pinned-hidden',
          topics: ['hide-portfolio']
        },
        'RafaelHDSV'
      )
    ).toBe(false)
  })

  it('exclui non-pin elegivel com hide-portfolio mesmo com forceInclude', () => {
    expect(
      isEligibleNonPinnedRepo({
        id: 10,
        name: 'force-include-hidden-topic',
        fork: false,
        html_url: 'https://github.com/RafaelHDSV/force-include-hidden-topic',
        homepage: 'https://example.com/demo',
        topics: ['hide-portfolio']
      })
    ).toBe(false)
  })
})
