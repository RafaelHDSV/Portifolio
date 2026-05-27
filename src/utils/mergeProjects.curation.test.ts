import { describe, expect, it, vi } from 'vitest'
import { IGithubResponseRepo } from '../types/IGithub'
import { collectPortfolioRepoCandidates } from './mergeProjects'

vi.mock('../constants/projects.config', () => ({
  projectsConfig: [
    {
      key: 'forced',
      repoName: 'Config-Only-Repo',
      name: 'Config Only',
      image: 'https://example.com/img.png',
      description: { pt: 'Desc', en: 'Desc' },
      languages: ['React'],
      urlGitHub: 'https://github.com/RafaelHDSV/Config-Only-Repo',
      forceInclude: true
    },
    {
      key: 'blocked',
      repoName: 'Blocked-Repo',
      name: 'Blocked',
      image: 'https://example.com/blocked.png',
      description: { pt: 'Desc', en: 'Desc' },
      languages: ['Node'],
      urlGitHub: 'https://github.com/RafaelHDSV/Blocked-Repo',
      forceExclude: true
    }
  ]
}))

function makeRepo (name: string): IGithubResponseRepo {
  return {
    id: 1,
    name,
    stargazers_count: 5,
    forks_count: 0,
    open_issues_count: 0,
    size: 100,
    updated_at: '2026-06-01T00:00:00Z',
    html_url: `https://github.com/RafaelHDSV/${name}`,
    fork: false
  }
}

describe('collectPortfolioRepoCandidates curation', () => {
  it('injeta repo forceInclude ausente na API', () => {
    const candidates = collectPortfolioRepoCandidates([], [makeRepo('api-repo')])

    expect(candidates.map((repo) => repo.name)).toContain('Config-Only-Repo')
    expect(candidates.map((repo) => repo.name)).toContain('api-repo')
  })

  it('exclui repo com forceExclude mesmo se pinned', () => {
    const candidates = collectPortfolioRepoCandidates(
      [makeRepo('Blocked-Repo')],
      [makeRepo('Blocked-Repo')]
    )

    expect(candidates.map((repo) => repo.name)).not.toContain('Blocked-Repo')
  })
})
