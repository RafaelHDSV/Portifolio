import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import pt from '../locales/pt.json'

const STORAGE_KEY = 'locale'

function getInitialLocale (): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'pt' || stored === 'en') return stored

  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('pt') ? 'pt' : 'en'
}

const initialLocale = getInitialLocale()

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en }
  },
  lng: initialLocale,
  fallbackLng: 'pt',
  interpolation: { escapeValue: false }
})

document.documentElement.lang = initialLocale === 'pt' ? 'pt-BR' : 'en'

export function setLocale (locale: 'pt' | 'en') {
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
  void i18n.changeLanguage(locale)
}

export default i18n
