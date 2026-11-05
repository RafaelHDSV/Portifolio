import { describe, expect, it } from 'vitest'
import {
  getPostImages,
  getPostVideoUrl,
  sanitizeMediaUrl,
  uniqueMediaUrls
} from './linkedinPostMedia'

describe('linkedinPostMedia', () => {
  it('remove aspas e duplicatas das URLs', () => {
    const urls = [
      'https://media.licdn.com/image-a"',
      '"https://media.licdn.com/image-a"',
      'https://media.licdn.com/image-b'
    ]

    expect(uniqueMediaUrls(urls)).toEqual([
      'https://media.licdn.com/image-a',
      'https://media.licdn.com/image-b'
    ])
  })

  it('identifica video e imagens de capa', () => {
    const urls = [
      'https://media.licdn.com/dms/image/v2/cover',
      'https://dms.licdn.com/playlist/vid/v2/demo/mp4-720p/file.mp4'
    ]

    expect(getPostVideoUrl(urls)).toBe(
      'https://dms.licdn.com/playlist/vid/v2/demo/mp4-720p/file.mp4'
    )
    expect(getPostImages(urls, 'video')).toEqual([
      'https://media.licdn.com/dms/image/v2/cover'
    ])
  })

  it('sanitiza URL com aspas no fim', () => {
    expect(sanitizeMediaUrl('https://example.com/file"')).toBe('https://example.com/file')
  })

  it('escolhe a melhor resolucao por asset e ignora thumbnails', () => {
    const asset = 'D4D22AQH9QFNFsGswvA'
    const urls = [
      `https://media.licdn.com/dms/image/v2/${asset}/feedshare-shrink_160/x`,
      `https://media.licdn.com/dms/image/v2/${asset}/feedshare-shrink_20/x`,
      `https://media.licdn.com/dms/image/v2/${asset}/feedshare-shrink_800/x`,
      `https://media.licdn.com/dms/image/v2/${asset}/feedshare-image-high-res/x`,
      `https://media.licdn.com/dms/image/v2/${asset}/feedshare-shrink_1280/x`
    ]

    expect(getPostImages(urls, 'imagem')).toEqual([
      `https://media.licdn.com/dms/image/v2/${asset}/feedshare-image-high-res/x`
    ])
  })

  it('mantem uma URL por asset distinto no carrossel', () => {
    const urls = [
      'https://media.licdn.com/dms/image/v2/ASSET_A/feedshare-shrink_160/a',
      'https://media.licdn.com/dms/image/v2/ASSET_B/feedshare-shrink_20/b',
      'https://media.licdn.com/dms/image/v2/ASSET_A/feedshare-shrink_800/a',
      'https://media.licdn.com/dms/image/v2/ASSET_B/feedshare-shrink_1280/b'
    ]

    expect(getPostImages(urls, 'imagem')).toEqual([
      'https://media.licdn.com/dms/image/v2/ASSET_A/feedshare-shrink_800/a',
      'https://media.licdn.com/dms/image/v2/ASSET_B/feedshare-shrink_1280/b'
    ])
  })
})
