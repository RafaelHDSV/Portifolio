import { describe, expect, it } from 'vitest'
import { getOgCopy } from './copy'
import { buildOgElement } from './template'

const AVATAR_SRC =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k='

describe('buildOgElement', () => {
  it('includes localized role and avatar image in tree', () => {
    const node = buildOgElement(getOgCopy('pt'), { avatarSrc: AVATAR_SRC })
    const serialized = JSON.stringify(node)

    expect(serialized).toContain('Desenvolvedor Full-Stack')
    expect(serialized).toContain('"type":"img"')
    expect(serialized).toContain(AVATAR_SRC)
  })
})
