import { describe, expect, it } from 'vitest'
import { getOgCopy } from './copy'
import { buildOgElement } from './template'

const AVATAR_SRC =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k='

const LOGO_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

describe('buildOgElement', () => {
  it('includes localized role, avatar and logo image in tree', () => {
    const node = buildOgElement(getOgCopy('pt'), {
      avatarSrc: AVATAR_SRC,
      logoSrc: LOGO_SRC
    })
    const serialized = JSON.stringify(node)

    expect(serialized).toContain('Desenvolvedor Full-Stack')
    expect(serialized).toContain('"type":"img"')
    expect(serialized).toContain(AVATAR_SRC)
    expect(serialized).toContain(LOGO_SRC)
  })
})
