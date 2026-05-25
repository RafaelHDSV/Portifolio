import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import pt from '../locales/pt.json'

const STORAGE_KEY = 'locale'
const SITE_URL = 'https://rafaelhdsv.vercel.app'

function localeFromSearch (): 'pt' | 'en' | null {
  const lang = new URLSearchParams(window.location.search).get('lang')
  if (lang === 'pt' || lang === 'en') return lang
  return null
}

function getInitialLocale (): 'pt' | 'en' {
  const fromUrl = localeFromSearch()
  if (fromUrl) return fromUrl

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'pt' || stored === 'en') return stored

  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('pt') ? 'pt' : 'en'
}

const initialLocale = getInitialLocale()

if (localeFromSearch()) {
  localStorage.setItem(STORAGE_KEY, initialLocale)
}

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en }
  },
  lng: initialLocale,
  fallbackLng: 'pt',
  interpolation: { escapeValue: false }
})

function upsertHreflang (hreflang: string, href: string) {
  let link = document.querySelector(
    `link[rel="alternate"][hreflang="${hreflang}"]`
  ) as HTMLLinkElement | null

  if (!link) {
    link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    document.head.appendChild(link)
  }

  link.href = href
}

export function updateHreflang (locale: 'pt' | 'en') {
  upsertHreflang('pt-BR', `${SITE_URL}/?lang=pt`)
  upsertHreflang('en', `${SITE_URL}/?lang=en`)
  upsertHreflang('x-default', `${SITE_URL}/`)

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = `${SITE_URL}/?lang=${locale}`
}

document.documentElement.lang = initialLocale === 'pt' ? 'pt-BR' : 'en'
updateHreflang(initialLocale)

export function setLocale (locale: 'pt' | 'en') {
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
  updateHreflang(locale)
  void i18n.changeLanguage(locale)
}

export default i18n
