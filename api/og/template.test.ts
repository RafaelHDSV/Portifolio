import { describe, expect, it } from 'vitest'
import { getOgCopy } from './copy'
import { buildOgElement } from './template'

describe('buildOgElement', () => {
  it('includes localized role in tree', () => {
    const node = buildOgElement(getOgCopy('pt'))
    expect(JSON.stringify(node)).toContain('Desenvolvedor Full-Stack')
  })
})
