import { describe, expect, it } from 'vitest'
import { ProjectCardData } from '../components/Card/Card'
import { IGithubResponseRepo } from '../types/IGithub'
import {
  applyMediaToCard,
  mergeGitHubProjects,
  pickProjectsByRepoNames,
  PROJECT_DISPLAY_LIMIT,
  sortReposByContributorsThenStarsSizeRecent,
  sortReposByRelevance,
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

describe('sortReposByRelevance', () => {
  it('prioritizes updated_at before languages, size and stars', () => {
    const recent = makeRepo({
      name: 'recent',
      stargazers_count: 1,
      size: 50,
      updated_at: '2026-06-01T00:00:00Z'
    })
    const olderMultiLang = makeRepo({
      name: 'older-multi',
      stargazers_count: 100,
      size: 5000,
      updated_at: '2024-01-01T00:00:00Z'
    })

    const languageCounts = new Map([
      ['recent', ['JavaScript']],
      ['older-multi', ['TypeScript', 'JavaScript', 'CSS']]
    ])

    const sorted = [olderMultiLang, recent].sort((a, b) =>
      sortReposByRelevance(a, b, new Map(), languageCounts)
    )

    expect(sorted[0].name).toBe('recent')
  })

  it('uses contributors before recency when counts differ', () => {
    const recentSolo = makeRepo({
      name: 'recent-solo',
      updated_at: '2026-06-01T00:00:00Z'
    })
    const olderCollab = makeRepo({
      name: 'older-collab',
      updated_at: '2024-01-01T00:00:00Z'
    })

    const contributorCounts = new Map([
      ['recent-solo', 1],
      ['older-collab', 5]
    ])

    const sorted = [recentSolo, olderCollab].sort((a, b) =>
      sortReposByRelevance(a, b, contributorCounts, new Map())
    )

    expect(sorted[0].name).toBe('older-collab')
  })

  it('uses languages, size and stars as tie-breakers after date', () => {
    const sameDateSmall = makeRepo({
      name: 'same-date-small',
      stargazers_count: 2,
      size: 100,
      updated_at: '2026-06-01T00:00:00Z'
    })
    const sameDateLarge = makeRepo({
      name: 'same-date-large',
      stargazers_count: 10,
      size: 1000,
      updated_at: '2026-06-01T00:00:00Z'
    })

    const languageCounts = new Map([
      ['same-date-small', ['TypeScript', 'CSS']],
      ['same-date-large', ['TypeScript', 'CSS']]
    ])

    const sorted = [sameDateSmall, sameDateLarge].sort((a, b) =>
      sortReposByRelevance(a, b, new Map(), languageCounts)
    )

    expect(sorted.map((repo) => repo.name)).toEqual([
      'same-date-large',
      'same-date-small'
    ])
  })
})

describe('mergeGitHubProjects pin priority', () => {
  it('keeps all valid pins first even when older non-pins score higher on size', () => {
    const pins = Array.from({ length: 6 }, (_, i) =>
      makeRepo({
        id: i + 1,
        name: `pin-${i + 1}`,
        size: 10,
        stargazers_count: 0,
        updated_at: '2026-05-01T00:00:00Z'
      })
    )

    const bulkyOld = Array.from({ length: PROJECT_DISPLAY_LIMIT }, (_, i) =>
      makeRepo({
        id: 100 + i,
        name: `old-bulk-${i}`,
        size: 50_000,
        stargazers_count: 50,
        updated_at: '2020-01-01T00:00:00Z',
        homepage: 'https://example.com',
        language: 'TypeScript'
      })
    )

    const cards = mergeGitHubProjects(pins, [...pins, ...bulkyOld], 'pt')
    const topNames = cards.slice(0, 6).map((card) => card.repoName)

    expect(topNames).toEqual([
      'pin-1',
      'pin-2',
      'pin-3',
      'pin-4',
      'pin-5',
      'pin-6'
    ])
    expect(cards.filter((card) => card.pinned)).toHaveLength(6)
  })

  it('keeps curso-* pins that the recent filter would drop', () => {
    const pins = [
      makeRepo({ id: 1, name: 'MedIT', language: 'TypeScript' }),
      makeRepo({ id: 2, name: 'curso-fullstack', language: 'TypeScript' }),
      makeRepo({ id: 3, name: 'keep-alive', language: 'TypeScript' }),
      makeRepo({ id: 4, name: 'pin-4', language: 'TypeScript' }),
      makeRepo({ id: 5, name: 'pin-5', language: 'TypeScript' }),
      makeRepo({ id: 6, name: 'pin-6', language: 'TypeScript' })
    ]

    const cards = mergeGitHubProjects(pins, pins, 'pt')
    const names = cards.map((card) => card.repoName)

    expect(names.slice(0, 6)).toEqual([
      'MedIT',
      'curso-fullstack',
      'keep-alive',
      'pin-4',
      'pin-5',
      'pin-6'
    ])
    expect(names).toContain('curso-fullstack')
  })
})

describe('mergeGitHubProjects quality gate', () => {
  it('keeps solid projects ahead of markup Frontend Mentor fillers', () => {
    const pins = [
      makeRepo({
        id: 1,
        name: 'MedIT',
        language: 'TypeScript',
        homepage: 'https://medit.example'
      })
    ]
    const challenge = makeRepo({
      id: 2,
      name: 'Tip-Calculator-App',
      language: 'CSS',
      homepage: 'https://tip-calculator-app-rafael.netlify.app',
      updated_at: '2026-08-02T00:00:00Z'
    })
    const solid = makeRepo({
      id: 3,
      name: 'keep-alive',
      language: 'TypeScript',
      homepage: 'https://www.npmjs.com/package/@rafaelhdsv/keep-alive',
      updated_at: '2026-07-01T00:00:00Z'
    })

    const cards = mergeGitHubProjects(pins, [...pins, challenge, solid], 'pt')
    const names = cards.map((c) => c.repoName)

    expect(names).toContain('MedIT')
    expect(names).toContain('keep-alive')
    expect(names).toContain('linkedin-posts')
    expect(names).toContain('Tip-Calculator-App')
    expect(names.indexOf('keep-alive')).toBeLessThan(
      names.indexOf('Tip-Calculator-App')
    )
  })
})

describe('sortReposByRelevance pushed_at', () => {
  it('prefers pushed_at over stale updated_at', () => {
    const recentlyPushed = makeRepo({
      name: 'fresh-push',
      updated_at: '2024-01-01T00:00:00Z',
      pushed_at: '2026-08-01T00:00:00Z'
    })
    const metadataBump = makeRepo({
      name: 'meta-bump',
      updated_at: '2026-08-02T00:00:00Z',
      pushed_at: '2023-01-01T00:00:00Z'
    })

    const sorted = [metadataBump, recentlyPushed].sort((a, b) =>
      sortReposByRelevance(a, b, new Map(), new Map())
    )

    expect(sorted[0].name).toBe('fresh-push')
  })

  it('sorts Frontend Mentor / markup challenges after regular projects', () => {
    const solid = makeRepo({
      name: 'keep-alive',
      language: 'TypeScript',
      homepage: 'https://www.npmjs.com/package/@rafaelhdsv/keep-alive',
      updated_at: '2026-01-01T00:00:00Z'
    })
    const fm = makeRepo({
      name: 'Product-list-with-cart',
      language: 'TypeScript',
      homepage: 'https://product-list-with-cart.example',
      description: 'Frontend Mentor challenge',
      updated_at: '2026-08-01T00:00:00Z'
    })

    const sorted = [fm, solid].sort((a, b) =>
      sortReposByRelevance(a, b, new Map(), new Map())
    )

    expect(sorted.map((repo) => repo.name)).toEqual([
      'keep-alive',
      'Product-list-with-cart'
    ])
  })
})

describe('pickProjectsByRepoNames', () => {
  it('returns featured repos even when they would fall outside display limit ranking', () => {
    const featured = [
      makeRepo({
        id: 1,
        name: 'MedIT',
        size: 500,
        updated_at: '2026-06-01T00:00:00Z'
      }),
      makeRepo({
        id: 2,
        name: 'Deprecated-Finder',
        size: 5,
        updated_at: '2026-05-01T00:00:00Z'
      }),
      makeRepo({
        id: 3,
        name: 'Dev-Shortcuts',
        size: 5,
        updated_at: '2026-04-01T00:00:00Z'
      })
    ]

    const distractors = Array.from({ length: PROJECT_DISPLAY_LIMIT }, (_, i) =>
      makeRepo({
        id: 200 + i,
        name: `noise-${i}`,
        size: 80_000,
        stargazers_count: 200,
        updated_at: '2026-07-01T00:00:00Z'
      })
    )

    const cards = pickProjectsByRepoNames(
      [],
      [...featured, ...distractors],
      ['MedIT', 'Deprecated-Finder', 'Dev-Shortcuts'],
      'pt'
    )

    expect(cards.map((card) => card.repoName)).toEqual([
      'MedIT',
      'Deprecated-Finder',
      'Dev-Shortcuts'
    ])
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
