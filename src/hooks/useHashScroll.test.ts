import { describe, expect, it } from 'vitest'
import { isHomeAnchorHash } from './useHashScroll'

describe('isHomeAnchorHash', () => {
  it('reconhece ancora da secao linkedin', () => {
    expect(isHomeAnchorHash('#linkedin-posts')).toBe(true)
  })

  it('ignora hash desconhecido', () => {
    expect(isHomeAnchorHash('#foo')).toBe(false)
  })
})
