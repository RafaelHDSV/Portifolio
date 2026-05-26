import { describe, expect, it } from 'vitest'
import { ProjectCardData } from '../components/Card/Card'
import { IGithubResponseRepo } from '../types/IGithub'
import {
  applyMediaToCard,
  sortReposByContributorsThenStarsSizeRecent,
  sortReposByStarsSizeThenRecent
} from './mergeProjects'

function makeRepo (overrides: Partial<IGithubResponseRepo> = {}): IGithubResponseRepo {
  return {
    id: 1,
    name: 'repo-a',
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    size: 100,
    updated_at: '2026-01-01T00:00:00Z',
    html_url: 'https://github.com/RafaelHDSV/repo-a',
    ...overrides
  }
}

function makeCard (overrides: Partial<ProjectCardData> = {}): ProjectCardData {
  return {
    id: 'repo-a',
    repoName: 'repo-a',
    name: 'Repo A',
    image: 'https://opengraph.githubassets.com/1/RafaelHDSV/repo-a',
    description: 'desc',
    languages: ['React'],
    urlGitHub: 'https://github.com/RafaelHDSV/repo-a',
    usesGithubPreview: true,
    github: {
      stars: 0,
      forks: 0,
      openIssues: 0,
      ogImage: 'https://opengraph.githubassets.com/1/RafaelHDSV/repo-a'
    },
    ...overrides
  }
}

describe('sortReposByStarsSizeThenRecent', () => {
  it('sorts by stars, then size, then updated_at', () => {
    const highStars = makeRepo({
      name: 'high-stars',
      stargazers_count: 10,
      size: 50,
      updated_at: '2026-01-01T00:00:00Z'
    })
    const highSize = makeRepo({
      name: 'high-size',
      stargazers_count: 10,
      size: 500,
      updated_at: '2026-01-01T00:00:00Z'
    })
    const recent = makeRepo({
      name: 'recent',
      stargazers_count: 10,
      size: 500,
      updated_at: '2026-06-01T00:00:00Z'
    })

    const sorted = [highStars, recent, highSize].sort(sortReposByStarsSizeThenRecent)

    expect(sorted.map((repo) => repo.name)).toEqual([
      'recent',
      'high-size',
      'high-stars'
    ])
  })
})

describe('sortReposByContributorsThenStarsSizeRecent', () => {
  it('prioritizes contributor count before stars', () => {
    const manyContributors = makeRepo({
      name: 'collab',
      stargazers_count: 0,
      size: 10
    })
    const popular = makeRepo({
      name: 'popular',
      stargazers_count: 100,
      size: 1000
    })

    const counts = new Map([
      ['collab', 5],
      ['popular', 1]
    ])

    const sorted = [popular, manyContributors].sort((a, b) =>
      sortReposByContributorsThenStarsSizeRecent(a, b, counts)
    )

    expect(sorted[0].name).toBe('collab')
  })
})

describe('applyMediaToCard', () => {
  it('uses OG when README has no demo media', () => {
    const card = makeCard()

    const result = applyMediaToCard(card, 'placeholder')

    expect(result.image).toBe(
      'https://opengraph.githubassets.com/1/RafaelHDSV/repo-a'
    )
    expect(result.usesGithubPreview).toBe(true)
    expect(result.usesPlaceholder).toBe(false)
    expect(result.media).toBeUndefined()
  })

  it('keeps existing resolved image when placeholder and card already has demo', () => {
    const card = makeCard({
      image: 'https://raw.githubusercontent.com/o/r/HEAD/public/desktop.png',
      usesGithubPreview: false,
      usesPlaceholder: false
    })

    const result = applyMediaToCard(card, 'placeholder')

    expect(result.image).toBe(card.image)
    expect(result.usesGithubPreview).toBe(false)
  })

  it('applies README image media to the card', () => {
    const card = makeCard()
    const media = {
      type: 'image' as const,
      url: 'https://raw.githubusercontent.com/o/r/HEAD/public/desktop.png'
    }

    const result = applyMediaToCard(card, media)

    expect(result.image).toBe(media.url)
    expect(result.media).toEqual(media)
    expect(result.usesGithubPreview).toBe(false)
    expect(result.usesPlaceholder).toBe(false)
  })

  it('keeps video without poster on placeholder until video loads', () => {
    const card = makeCard()
    const media = {
      type: 'video' as const,
      url: 'https://example.com/demo.mp4'
    }

    const result = applyMediaToCard(card, media)

    expect(result.image).toBe('')
    expect(result.usesGithubPreview).toBe(false)
    expect(result.usesPlaceholder).toBe(true)
    expect(result.media).toEqual(media)
  })

  it('uses video poster when provided', () => {
    const card = makeCard()
    const poster = 'https://raw.githubusercontent.com/o/r/HEAD/preview.png'
    const media = {
      type: 'video' as const,
      url: 'https://example.com/demo.mp4',
      poster
    }

    const result = applyMediaToCard(card, media)

    expect(result.image).toBe(poster)
    expect(result.usesGithubPreview).toBe(false)
    expect(result.usesPlaceholder).toBe(false)
  })

  it('applies gif media directly', () => {
    const card = makeCard()
    const media = {
      type: 'gif' as const,
      url: 'https://raw.githubusercontent.com/o/r/HEAD/media/demo.gif'
    }

    const result = applyMediaToCard(card, media)

    expect(result.image).toBe(media.url)
    expect(result.media?.type).toBe('gif')
  })
})
