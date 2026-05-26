import { describe, expect, it } from 'vitest'
import {
  getPrimaryImageUrl,
  nextFallbackStage,
  resolveCardImageDisplay
} from './cardImageFallback'

const primary = 'https://example.com/demo.png'

describe('getPrimaryImageUrl', () => {
  it('prefers gif media url over card image', () => {
    expect(
      getPrimaryImageUrl({
        image: 'https://example.com/card.png',
        media: { type: 'gif', url: 'https://example.com/demo.gif' }
      })
    ).toBe('https://example.com/demo.gif')
  })
})

describe('nextFallbackStage', () => {
  it('always moves to placeholder', () => {
    expect(nextFallbackStage()).toBe('placeholder')
  })
})

describe('resolveCardImageDisplay', () => {
  it('returns primary url on primary stage', () => {
    expect(resolveCardImageDisplay('primary', primary)).toEqual({
      src: primary
    })
  })

  it('returns null src on placeholder stage', () => {
    expect(resolveCardImageDisplay('placeholder', primary)).toEqual({
      src: null
    })
  })

  it('prefers image url for image media type', () => {
    expect(
      getPrimaryImageUrl({
        image: '',
        media: {
          type: 'image',
          url: 'https://github.com/user-attachments/assets/example'
        }
      })
    ).toBe('https://github.com/user-attachments/assets/example')
  })
})
