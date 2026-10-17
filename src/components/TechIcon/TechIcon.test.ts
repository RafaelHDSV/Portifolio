import { describe, expect, it } from 'vitest'
import { resolveTechIconKey } from './TechIcon'

describe('resolveTechIconKey', () => {
  it('resolve linguagens pedidas e aliases comuns', () => {
    expect(resolveTechIconKey('Kotlin')).toBe('kotlin')
    expect(resolveTechIconKey('PLpgSQL')).toBe('plpgsql')
    expect(resolveTechIconKey('PostgreSQL')).toBe('postgresql')
    expect(resolveTechIconKey('Python')).toBe('python')
    expect(resolveTechIconKey('Java')).toBe('java')
    expect(resolveTechIconKey('Shell')).toBe('shell')
    expect(resolveTechIconKey('Node')).toBe('node')
    expect(resolveTechIconKey('Batchfile')).toBe('batchfile')
  })

  it('e case-insensitive e ignora espacos', () => {
    expect(resolveTechIconKey('  typescript  ')).toBe('typescript')
    expect(resolveTechIconKey('REACT')).toBe('react')
  })

  it('retorna null para linguagem desconhecida', () => {
    expect(resolveTechIconKey('VBScript')).toBeNull()
    expect(resolveTechIconKey('')).toBeNull()
  })
})
