import { describe, expect, it } from 'vitest'
import { buildOgImageUrl, getOgCopy, normalizeOgLang, parseLangFromUrl, parseRequestLang } from './copy'

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
      'https://rafaelhdsv.vercel.app/og-en.png'
    )
  })
})

describe('parseLangFromUrl', () => {
  it('parses lang from relative url', () => {
    expect(parseLangFromUrl('/api/og?lang=en')).toBe('en')
  })

  it('defaults to pt when lang is missing', () => {
    expect(parseLangFromUrl('/api/og')).toBe('pt')
  })
})

describe('parseRequestLang', () => {
  it('delegates to parseLangFromUrl', () => {
    const request = { url: '/api/og?lang=en' } as Request
    expect(parseRequestLang(request)).toBe('en')
  })
})
