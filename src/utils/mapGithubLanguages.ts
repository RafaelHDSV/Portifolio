import { PROJECT_FILTER_OPTIONS } from './mergeProjects'

const LANGUAGE_MAP: Record<string, string> = {
  TypeScript: 'Typescript',
  JavaScript: 'Javascript',
  HTML: 'HTML',
  CSS: 'CSS',
  PowerShell: 'Javascript',
  'C#': 'API',
  PHP: 'API',
  Shell: 'API',
  Python: 'API'
}

const TOPIC_MAP: Record<string, string> = {
  react: 'React',
  node: 'Node',
  typescript: 'Typescript',
  javascript: 'Javascript',
  api: 'API'
}

export function mapGithubLanguagesToBadges (
  apiLanguages: string[],
  topics?: string[]
): string[] {
  const set = new Set<string>()

  for (const lang of apiLanguages) {
    const mapped = LANGUAGE_MAP[lang] ?? lang
    const normalized = PROJECT_FILTER_OPTIONS.find(
      (f) => f.toLowerCase() === mapped.toLowerCase()
    )
    set.add(normalized ?? mapped)
  }

  for (const topic of topics ?? []) {
    const mapped = TOPIC_MAP[topic.toLowerCase()]
    if (mapped) set.add(mapped)
  }

  return [...set].slice(0, 6)
}
