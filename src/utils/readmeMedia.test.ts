import { describe, expect, it } from 'vitest'
import { isLikelyDemoMedia, parseReadmeMedia } from './readmeMedia'

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

  it('returns null when README has no demo media', () => {
    const readme = `
# Upload de Arquivos

Aplicacao web em PHP sem imagens no README.
`

    expect(parseReadmeMedia(readme, owner, 'Upload-de-Arquivos')).toBeNull()
  })
})
