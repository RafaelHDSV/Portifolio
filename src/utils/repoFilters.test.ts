import { describe, expect, it } from 'vitest'
import { IGithubResponseRepo } from '../types/IGithub'
import {
  configToSyntheticRepo,
  filterPinnedReposForPortfolio,
  filterReposForPortfolio,
  isEligibleNonPinnedRepo,
  shouldIncludePinnedRepo,
  shouldIncludeRepo
} from './repoFilters'

const USERNAME = 'RafaelHDSV'

function makeRepo (overrides: Partial<IGithubResponseRepo> = {}): IGithubResponseRepo {
  return {
    id: 1,
    name: 'demo-repo',
    stargazers_count: 1,
    forks_count: 0,
    open_issues_count: 0,
    size: 10,
    updated_at: '2026-01-01T00:00:00Z',
    html_url: 'https://github.com/RafaelHDSV/demo-repo',
    fork: false,
    ...overrides
  }
}

describe('shouldIncludeRepo', () => {
  it('excludes forks by default', () => {
    expect(shouldIncludeRepo(makeRepo({ fork: true }), USERNAME)).toBe(false)
  })

  it('excludes repos with estudo prefix', () => {
    expect(
      shouldIncludeRepo(makeRepo({ name: 'estudo-react' }), USERNAME)
    ).toBe(false)
  })

  it('excludes portfolio username repo', () => {
    expect(
      shouldIncludeRepo(makeRepo({ name: 'RafaelHDSV' }), USERNAME)
    ).toBe(false)
  })
})

describe('configToSyntheticRepo', () => {
  it('builds repo stub from config with zero stats', () => {
    const repo = configToSyntheticRepo({
      key: '99',
      repoName: 'Only-Config',
      name: 'Only Config',
      image: '/img.png',
      description: { pt: 'Desc PT', en: 'Desc EN' },
      languages: ['React'],
      urlGitHub: 'https://github.com/RafaelHDSV/Only-Config',
      forceInclude: true
    })

    expect(repo.name).toBe('Only-Config')
    expect(repo.stargazers_count).toBe(0)
    expect(repo.html_url).toBe('https://github.com/RafaelHDSV/Only-Config')
  })
})

describe('filterReposForPortfolio', () => {
  it('filters fork repos from list', () => {
    const repos = [
      makeRepo({ name: 'valid' }),
      makeRepo({ name: 'forked', fork: true })
    ]

    expect(filterReposForPortfolio(repos, USERNAME)).toHaveLength(1)
  })
})

describe('shouldIncludePinnedRepo', () => {
  it('keeps curso-* pins that would be excluded from recent list', () => {
    expect(
      shouldIncludePinnedRepo(makeRepo({ name: 'curso-react-avancado' }), USERNAME)
    ).toBe(true)
    expect(
      shouldIncludeRepo(makeRepo({ name: 'curso-react-avancado' }), USERNAME)
    ).toBe(false)
  })

  it('still excludes forks and profile README from pins', () => {
    expect(shouldIncludePinnedRepo(makeRepo({ fork: true }), USERNAME)).toBe(
      false
    )
    expect(
      shouldIncludePinnedRepo(makeRepo({ name: USERNAME }), USERNAME)
    ).toBe(false)
  })

  it('excludes FORCE_EXCLUDED pin names', () => {
    expect(shouldIncludePinnedRepo(makeRepo({ name: 'cvs' }), USERNAME)).toBe(
      false
    )
  })
})

describe('filterPinnedReposForPortfolio', () => {
  it('keeps soft-filtered pins including curso prefix', () => {
    const repos = [
      makeRepo({ name: 'MedIT' }),
      makeRepo({ name: 'curso-node' }),
      makeRepo({ name: 'cvs' }),
      makeRepo({ name: 'forked-pin', fork: true })
    ]

    expect(
      filterPinnedReposForPortfolio(repos, USERNAME).map((r) => r.name)
    ).toEqual(['MedIT', 'curso-node'])
  })
})

describe('isEligibleNonPinnedRepo', () => {
  it('rejects markup-only challenge without homepage', () => {
    expect(
      isEligibleNonPinnedRepo(
        makeRepo({
          name: 'Tip-Calculator-App',
          language: 'CSS',
          homepage: null
        })
      )
    ).toBe(false)
  })

  it('accepts TypeScript repo with homepage', () => {
    expect(
      isEligibleNonPinnedRepo(
        makeRepo({
          name: 'keep-alive',
          language: 'TypeScript',
          homepage: 'https://www.npmjs.com/package/@rafaelhdsv/keep-alive'
        })
      )
    ).toBe(true)
  })

  it('does not treat projectsConfig alone as eligibility bypass', () => {
    expect(
      isEligibleNonPinnedRepo(
        makeRepo({
          name: 'Oak-Tecnologia',
          language: 'JavaScript',
          homepage: 'https://oak-tecnologia.vercel.app'
        })
      )
    ).toBe(false)
  })

  it('accepts Frontend Mentor challenges with demo at low priority eligibility', () => {
    expect(
      isEligibleNonPinnedRepo(
        makeRepo({
          name: 'Product-list-with-cart',
          language: 'TypeScript',
          homepage: 'https://product-list-with-cart-gilt-five.vercel.app',
          description:
            'Este projeto é uma solução para o desafio Product List with Cart do Frontend Mentor.'
        })
      )
    ).toBe(true)
  })

  it('accepts Portifolio with homepage', () => {
    expect(
      isEligibleNonPinnedRepo(
        makeRepo({
          name: 'Portifolio',
          language: 'TypeScript',
          homepage: 'https://rafaelhdsv.vercel.app'
        })
      )
    ).toBe(true)
  })

  it('accepts forceInclude repo without homepage (linkedin-posts)', () => {
    expect(
      isEligibleNonPinnedRepo(
        makeRepo({
          name: 'linkedin-posts',
          language: 'TypeScript',
          homepage: null
        })
      )
    ).toBe(true)
  })
})
