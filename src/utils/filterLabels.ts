import type { TFunction } from 'i18next'

const FILTER_I18N_KEYS: Record<string, string> = {
  'C#': 'projects.filters.cSharp',
  Sass: 'projects.filters.Sass',
  PowerShell: 'projects.filters.PowerShell',
  React: 'projects.filters.React',
  Typescript: 'projects.filters.Typescript',
  Javascript: 'projects.filters.Javascript',
  Node: 'projects.filters.Node',
  API: 'projects.filters.API',
  CSS: 'projects.filters.CSS',
  HTML: 'projects.filters.HTML'
}

export function getProjectFilterLabel (filter: string, t: TFunction): string {
  const key = FILTER_I18N_KEYS[filter] ?? FILTER_I18N_KEYS[filter.replace('#', 'Sharp')]
  if (key) return t(key)
  return filter
}
