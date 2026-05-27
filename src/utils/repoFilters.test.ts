import { describe, expect, it } from 'vitest'
import { IGithubResponseRepo } from '../types/IGithub'
import {
  configToSyntheticRepo,
  filterReposForPortfolio,
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
