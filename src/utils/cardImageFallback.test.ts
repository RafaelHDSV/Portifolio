import { describe, expect, it } from 'vitest'
import {
  getPrimaryImageUrl,
  nextFallbackStage,
  resolveCardImageDisplay,
  shouldShowGithubPreviewCard
} from './cardImageFallback'

const og = 'https://opengraph.githubassets.com/1/user/repo'
const broken = 'https://example.com/broken.png'

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
  it('moves primary to og when og differs', () => {
    expect(nextFallbackStage('primary', broken, og)).toBe('og')
  })

  it('skips og when primary already is og', () => {
    expect(nextFallbackStage('primary', og, og)).toBe('placeholder')
  })

  it('moves og to placeholder', () => {
    expect(nextFallbackStage('og', broken, og)).toBe('placeholder')
  })
})

describe('resolveCardImageDisplay', () => {
  it('returns primary url on primary stage', () => {
    expect(resolveCardImageDisplay('primary', broken, og)).toEqual({
      src: broken,
      usesGithubPreviewUx: false
    })
  })

  it('returns og url with preview ux on og stage', () => {
    expect(resolveCardImageDisplay('og', broken, og)).toEqual({
      src: og,
      usesGithubPreviewUx: true
    })
  })

  it('returns null src on placeholder stage', () => {
    expect(resolveCardImageDisplay('placeholder', broken, og)).toEqual({
      src: null,
      usesGithubPreviewUx: true
    })
  })
})

describe('shouldShowGithubPreviewCard', () => {
  it('is true when project already uses github preview', () => {
    expect(shouldShowGithubPreviewCard(true, 'primary')).toBe(true)
  })

  it('is true when fallback stage is og', () => {
    expect(shouldShowGithubPreviewCard(false, 'og')).toBe(true)
  })

  it('is false for primary readme image', () => {
    expect(shouldShowGithubPreviewCard(false, 'primary')).toBe(false)
  })
})
