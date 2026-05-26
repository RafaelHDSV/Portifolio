export const OG_SITE_URL = 'https://rafaelhdsv.vercel.app'

export type OgLang = 'pt' | 'en'

export interface OgCopy {
  name: string
  role: string
  stack: string
  label: string
}

const COPY: Record<OgLang, OgCopy> = {
  pt: {
    name: 'Rafael Vieira',
    role: 'Desenvolvedor Full-Stack',
    stack: 'React · TypeScript · Node.js',
    label: 'Portfolio'
  },
  en: {
    name: 'Rafael Vieira',
    role: 'Full-Stack Developer',
    stack: 'React · TypeScript · Node.js',
    label: 'Portfolio'
  }
}

export function normalizeOgLang (value: string | null | undefined): OgLang {
  if (value?.toLowerCase().startsWith('en')) return 'en'
  return 'pt'
}

export function getOgCopy (lang: OgLang): OgCopy {
  return COPY[lang]
}

export function buildOgImageUrl (lang: OgLang = 'pt'): string {
  return `${OG_SITE_URL}/api/og?lang=${lang}`
}

export function parseLangFromUrl (url: string): OgLang {
  const { searchParams } = url.startsWith('http')
    ? new URL(url)
    : new URL(url, OG_SITE_URL)
  return normalizeOgLang(searchParams.get('lang'))
}

export function parseRequestLang (request: Request): OgLang {
  return parseLangFromUrl(request.url)
}
