import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ImageResponse } from '@vercel/og'
import type { ReactElement } from 'react'
import { getOgCopy, type OgLang } from '../api/og/copy'
import { buildOgElement } from '../api/og/template'

const AVATAR_PATH = 'public/og/avatar.jpg'
const OG_WIDTH = 1200
const OG_HEIGHT = 630

function loadAvatarDataUrl (): string {
  if (!existsSync(AVATAR_PATH)) {
    throw new Error(
      `avatar not found at ${AVATAR_PATH} — run: curl -L "https://github.com/RafaelHDSV.png?size=460" -o ${AVATAR_PATH}`
    )
  }

  const buffer = readFileSync(AVATAR_PATH)
  const mime = AVATAR_PATH.endsWith('.png') ? 'image/png' : 'image/jpeg'

  return `data:${mime};base64,${buffer.toString('base64')}`
}

async function generateOgImage (
  lang: OgLang,
  avatarSrc: string
): Promise<void> {
  const response = await new ImageResponse(
    buildOgElement(getOgCopy(lang), { avatarSrc }) as ReactElement,
    { width: OG_WIDTH, height: OG_HEIGHT }
  )
  const buffer = Buffer.from(await response.arrayBuffer())
  writeFileSync(`public/og-${lang}.png`, buffer)
  console.log(`generated public/og-${lang}.png (${buffer.byteLength} bytes)`)
}

async function main (): Promise<void> {
  const avatarSrc = loadAvatarDataUrl()

  await generateOgImage('pt', avatarSrc)
  await generateOgImage('en', avatarSrc)

  copyFileSync('public/og-pt.png', 'public/main.png')
  console.log('copied public/og-pt.png → public/main.png')
}

main().catch((error: unknown) => {
  console.error('failed to generate og images:', error)
  process.exit(1)
})
