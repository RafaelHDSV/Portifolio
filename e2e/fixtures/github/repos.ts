const OWNER = 'RafaelHDSV'

export type MockRepo = {
  id: number
  name: string
  full_name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  size: number
  html_url: string
  updated_at: string
  fork: boolean
  private: boolean
  topics?: string[]
}

export const MOCK_REPOS: MockRepo[] = [
  {
    id: 101,
    name: 'repo-react-ts',
    full_name: `${OWNER}/repo-react-ts`,
    description: 'Portfolio E2E — React + TypeScript',
    language: 'TypeScript',
    stargazers_count: 12,
    forks_count: 2,
    open_issues_count: 0,
    size: 240,
    html_url: `https://github.com/${OWNER}/repo-react-ts`,
    updated_at: '2026-05-20T00:00:00Z',
    fork: false,
    private: false,
    topics: ['react']
  },
  {
    id: 102,
    name: 'repo-react-only',
    full_name: `${OWNER}/repo-react-only`,
    description: 'Portfolio E2E — React only',
    language: 'JavaScript',
    stargazers_count: 8,
    forks_count: 1,
    open_issues_count: 0,
    size: 180,
    html_url: `https://github.com/${OWNER}/repo-react-only`,
    updated_at: '2026-05-18T00:00:00Z',
    fork: false,
    private: false,
    topics: ['react']
  },
  {
    id: 103,
    name: 'repo-node',
    full_name: `${OWNER}/repo-node`,
    description: 'Portfolio E2E — Node API',
    language: 'JavaScript',
    stargazers_count: 5,
    forks_count: 0,
    open_issues_count: 1,
    size: 120,
    html_url: `https://github.com/${OWNER}/repo-node`,
    updated_at: '2026-05-15T00:00:00Z',
    fork: false,
    private: false,
    topics: ['node']
  }
]

export const MOCK_PINNED = [MOCK_REPOS[0]]

export const MOCK_LANGUAGES: Record<string, string[]> = {
  'repo-react-ts': ['TypeScript', 'React'],
  'repo-react-only': ['JavaScript', 'React'],
  'repo-node': ['JavaScript']
}

function toPinnedNode (repo: MockRepo) {
  return {
    databaseId: repo.id,
    name: repo.name,
    description: repo.description,
    homepageUrl: null,
    url: repo.html_url,
    updatedAt: repo.updated_at,
    stargazersCount: repo.stargazers_count,
    forkCount: repo.forks_count,
    diskUsage: repo.size,
    issues: { totalCount: repo.open_issues_count },
    isFork: repo.fork,
    isPrivate: repo.private,
    primaryLanguage: { name: repo.language },
    repositoryTopics: {
      nodes: (repo.topics ?? []).map((topic) => ({ topic: { name: topic } }))
    }
  }
}

export function buildPinnedGraphqlResponse () {
  return {
    data: {
      user: {
        pinnedItems: {
          nodes: MOCK_PINNED.map(toPinnedNode)
        }
      }
    }
  }
}

export function buildLanguagesGraphqlResponse (repoNames: string[]) {
  const data: Record<string, unknown> = {}

  repoNames.forEach((name, index) => {
    const langs = MOCK_LANGUAGES[name] ?? []
    data[`r${index}`] = {
      name,
      languages: {
        edges: langs.map((lang) => ({ node: { name: lang } }))
      }
    }
  })

  return { data }
}
