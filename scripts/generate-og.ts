import { writeFileSync } from 'node:fs'
import { ImageResponse } from '@vercel/og'
import type { ReactElement } from 'react'
import { getOgCopy, type OgLang } from '../api/og/copy'
import { buildOgElement } from '../api/og/template'

async function generateOgImage (lang: OgLang): Promise<void> {
  const response = await new ImageResponse(
    buildOgElement(getOgCopy(lang)) as ReactElement,
    { width: 1200, height: 630 }
  )
  const buffer = Buffer.from(await response.arrayBuffer())
  writeFileSync(`public/og-${lang}.png`, buffer)
  console.log(`generated public/og-${lang}.png (${buffer.byteLength} bytes)`)
}

async function main (): Promise<void> {
  await generateOgImage('pt')
  await generateOgImage('en')
}

main().catch((error: unknown) => {
  console.error('failed to generate og images:', error)
  process.exit(1)
})
