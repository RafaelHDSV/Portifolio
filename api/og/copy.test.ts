import { describe, expect, it } from 'vitest'
import { buildOgImageUrl, getOgCopy, normalizeOgLang } from './copy'

describe('normalizeOgLang', () => {
  it('defaults to pt', () => {
    expect(normalizeOgLang(null)).toBe('pt')
    expect(normalizeOgLang('pt-BR')).toBe('pt')
  })

  it('detects en', () => {
    expect(normalizeOgLang('en')).toBe('en')
    expect(normalizeOgLang('EN-US')).toBe('en')
  })
})

describe('getOgCopy', () => {
  it('returns localized role', () => {
    expect(getOgCopy('pt').role).toBe('Desenvolvedor Full-Stack')
    expect(getOgCopy('en').role).toBe('Full-Stack Developer')
  })
})

describe('buildOgImageUrl', () => {
  it('builds absolute api url with lang', () => {
    expect(buildOgImageUrl('en')).toBe(
      'https://rafaelhdsv.vercel.app/api/og?lang=en'
    )
  })
})
