import { describe, expect, it } from 'vitest'
import {
  isEmbeddableMediaUrl,
  isLikelyDemoMedia,
  parseReadmeMedia,
  pickBestEmbeddableMedia
} from './readmeMedia'

describe('isLikelyDemoMedia', () => {
  it('rejects shields and badges', () => {
    expect(
      isLikelyDemoMedia(
        'https://img.shields.io/badge/React-005CFE?style=for-the-badge'
      )
    ).toBe(false)
  })

  it('rejects GitHub opengraph preview URLs', () => {
    expect(
      isLikelyDemoMedia(
        'https://opengraph.githubassets.com/1/RafaelHDSV/TechMoto'
      )
    ).toBe(false)
  })

  it('rejects logo and icon paths', () => {
    expect(
      isLikelyDemoMedia(
        'https://raw.githubusercontent.com/o/r/HEAD/public/logo.png'
      )
    ).toBe(false)
    expect(
      isLikelyDemoMedia(
        'https://raw.githubusercontent.com/o/r/HEAD/images/app-icon.png'
      )
    ).toBe(false)
  })

  it('accepts user-attachments assets', () => {
    expect(
      isLikelyDemoMedia(
        'https://github.com/user-attachments/assets/2a5be513-c0ea-4c45-8431-570299427437'
      )
    ).toBe(true)
  })

  it('accepts common demo paths and extensions', () => {
    expect(
      isLikelyDemoMedia(
        'https://raw.githubusercontent.com/o/r/HEAD/public/desktop.png'
      )
    ).toBe(true)
    expect(
      isLikelyDemoMedia(
        'https://raw.githubusercontent.com/o/r/HEAD/images/main.png'
      )
    ).toBe(true)
    expect(
      isLikelyDemoMedia(
        'https://raw.githubusercontent.com/o/r/HEAD/media/demo.gif'
      )
    ).toBe(true)
    expect(
      isLikelyDemoMedia('https://example.com/preview/demo.mp4')
    ).toBe(true)
  })
})

describe('isEmbeddableMediaUrl', () => {
  it('rejects github user-attachments video', () => {
    expect(
      isEmbeddableMediaUrl(
        'https://github.com/user-attachments/assets/46325e0e-664f-4812-bc0b-c12a655f60e6',
        'video'
      )
    ).toBe(false)
  })

  it('accepts github user-attachments image', () => {
    expect(
      isEmbeddableMediaUrl(
        'https://github.com/user-attachments/assets/dd44ff70-77dc-45f8-bd9e-1a24cf322ec6',
        'image'
      )
    ).toBe(true)
  })

  it('accepts raw github urls', () => {
    expect(
      isEmbeddableMediaUrl(
        'https://raw.githubusercontent.com/RafaelHDSV/Repo-Workspace/HEAD/demo.mp4',
        'video'
      )
    ).toBe(true)
  })
})

describe('pickBestEmbeddableMedia', () => {
  it('prefers raw demo.mp4 over user-attachments video', () => {
    const rawVideo = {
      type: 'video' as const,
      url: 'https://raw.githubusercontent.com/RafaelHDSV/Repo-Workspace/HEAD/demo.mp4'
    }
    const attachmentVideo = {
      type: 'video' as const,
      url: 'https://github.com/user-attachments/assets/46325e0e-664f-4812-bc0b-c12a655f60e6'
    }

    const picked = pickBestEmbeddableMedia([null, attachmentVideo, rawVideo])

    expect(picked?.url).toBe(rawVideo.url)
  })
})

describe('parseReadmeMedia', () => {
  const owner = 'RafaelHDSV'
  const repo = 'Zip-Code-Finder'

  it('ignores badge images and picks screenshot desktop.png', () => {
    const readme = `
![badge](https://img.shields.io/badge/React-blue)

### Screenshot

![](public/desktop.png)
`

    const result = parseReadmeMedia(readme, owner, repo)

    expect(result?.url).toBe(
      'https://raw.githubusercontent.com/RafaelHDSV/Zip-Code-Finder/HEAD/public/desktop.png'
    )
    expect(result?.type).toBe('image')
  })

  it('prefers screenshot section over hero badge noise', () => {
    const readme = `
<img src="https://img.shields.io/badge/C%23-green" alt="badge" />

## Overview

### Screenshot

![](images/desktop.png)
`

    const result = parseReadmeMedia(readme, owner, 'Inverted-World')

    expect(result?.url).toContain('/images/desktop.png')
  })

  it('does not treat TOC #screenshot anchor as a media section header', () => {
    const readme = `
![](images/main.png)

## Table of contents

- [Screenshot](#screenshot)

## Overview

### Screenshot

![](images/desktop.png)
`

    const result = parseReadmeMedia(readme, owner, 'Inverted-World')

    expect(result?.url).toContain('/images/desktop.png')
  })

  it('parses user-attachments screenshot from html img as image', () => {
    const readme = `
<p align="center">
  <img src="https://github.com/user-attachments/assets/dd44ff70-77dc-45f8-bd9e-1a24cf322ec6" alt="Tela Principal" width="600">
</p>
`

    const result = parseReadmeMedia(readme, owner, 'TechMoto')

    expect(result?.type).toBe('image')
    expect(result?.url).toBe(
      'https://github.com/user-attachments/assets/dd44ff70-77dc-45f8-bd9e-1a24cf322ec6'
    )
  })

  it('parses bare user-attachments url as video', () => {
    const readme = `
# repo-workspace

https://github.com/user-attachments/assets/46325e0e-664f-4812-bc0b-c12a655f60e6
`

    const result = parseReadmeMedia(readme, owner, 'Repo-Workspace')

    expect(result?.type).toBe('video')
    expect(result?.url).toBe(
      'https://github.com/user-attachments/assets/46325e0e-664f-4812-bc0b-c12a655f60e6'
    )
  })

  it('returns null when README has no demo media', () => {
    const readme = `
# Upload de Arquivos

Aplicacao web em PHP sem imagens no README.
`

    expect(parseReadmeMedia(readme, owner, 'Upload-de-Arquivos')).toBeNull()
  })
})
