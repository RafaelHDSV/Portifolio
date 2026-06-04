import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import pt from '../locales/pt.json'

const STORAGE_KEY = 'locale'

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

function updateDocumentLang (locale: 'pt' | 'en') {
  document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
}

function stripLangQueryFromUrl () {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('lang')) return

  url.searchParams.delete('lang')
  const next = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState(null, '', next || '/')
}

const initialLocale = getInitialLocale()

if (localeFromSearch()) {
  localStorage.setItem(STORAGE_KEY, initialLocale)
  stripLangQueryFromUrl()
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

updateDocumentLang(initialLocale)

export function setLocale (locale: 'pt' | 'en') {
  localStorage.setItem(STORAGE_KEY, locale)
  updateDocumentLang(locale)
  void i18n.changeLanguage(locale)
}

export default i18n
