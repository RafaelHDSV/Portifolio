import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import type { ReactNode } from 'react'
import satori from 'satori'
import sharp from 'sharp'
import { getOgCopy, type OgLang } from '../api/og/copy'
import { buildOgElement } from '../api/og/template'

const AVATAR_PATH = 'public/og/avatar.jpg'
const LOGO_PATH = 'public/og/logo-rv.png'
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const INTER_CDN =
  'https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.8/latin-{weight}-normal.woff'

function loadImageDataUrl (filePath: string): string {
  if (!existsSync(filePath)) {
    throw new Error(`image not found at ${filePath}`)
  }

  const buffer = readFileSync(filePath)
  const mime = filePath.endsWith('.png') ? 'image/png' : 'image/jpeg'

  return `data:${mime};base64,${buffer.toString('base64')}`
}

function loadAvatarDataUrl (): string {
  if (!existsSync(AVATAR_PATH)) {
    throw new Error(
      `avatar not found at ${AVATAR_PATH} — run: curl -L "https://github.com/RafaelHDSV.png?size=460" -o ${AVATAR_PATH}`
    )
  }

  return loadImageDataUrl(AVATAR_PATH)
}

function loadLogoDataUrl (): string {
  return loadImageDataUrl(LOGO_PATH)
}

async function loadInter (weight: 400 | 600 | 700): Promise<ArrayBuffer> {
  const url = INTER_CDN.replace('{weight}', String(weight))
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`failed to download Inter ${weight}: ${response.status} ${url}`)
  }

  return response.arrayBuffer()
}

async function generateOgImage (
  lang: OgLang,
  avatarSrc: string,
  logoSrc: string,
  fonts: { name: string, data: ArrayBuffer, weight: 400 | 600 | 700, style: 'normal' }[]
): Promise<void> {
  const svg = await satori(
    buildOgElement(getOgCopy(lang), { avatarSrc, logoSrc }) as unknown as ReactNode,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts }
  )
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer()
  writeFileSync(`public/og-${lang}.png`, buffer)
  console.log(`generated public/og-${lang}.png (${buffer.byteLength} bytes)`)
}

async function main (): Promise<void> {
  const avatarSrc = loadAvatarDataUrl()
  const logoSrc = loadLogoDataUrl()
  const [regular, semibold, bold] = await Promise.all([
    loadInter(400),
    loadInter(600),
    loadInter(700)
  ])
  const fonts = [
    { name: 'sans-serif', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'sans-serif', data: semibold, weight: 600 as const, style: 'normal' as const },
    { name: 'sans-serif', data: bold, weight: 700 as const, style: 'normal' as const }
  ]

  await generateOgImage('pt', avatarSrc, logoSrc, fonts)
  await generateOgImage('en', avatarSrc, logoSrc, fonts)

  copyFileSync('public/og-pt.png', 'public/main.png')
  console.log('copied public/og-pt.png → public/main.png')
}

main().catch((error: unknown) => {
  console.error('failed to generate og images:', error)
  process.exit(1)
})
