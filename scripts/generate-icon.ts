import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import sharp from 'sharp'

const LOGO_SOURCE = 'src/assets/logo-rv-mark.png'
const ICON_OUT = 'public/icon.png'
const OG_LOGO_OUT = 'public/og/logo-rv.png'
const CANVAS = 512
const MARK_RATIO = 0.58
const BG = { r: 10, g: 10, b: 11, alpha: 1 }

async function buildSquareLogo (outputPath: string): Promise<void> {
  if (!existsSync(LOGO_SOURCE)) {
    throw new Error(`logo source not found at ${LOGO_SOURCE}`)
  }

  const markSize = Math.round(CANVAS * MARK_RATIO)
  const markBuffer = await sharp(LOGO_SOURCE)
    .resize(markSize, markSize, { fit: 'contain' })
    .png()
    .toBuffer()

  mkdirSync(dirname(outputPath), { recursive: true })

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: BG
    }
  })
    .composite([{ input: markBuffer, gravity: 'center' }])
    .png()
    .toFile(outputPath)
}

async function main (): Promise<void> {
  await buildSquareLogo(ICON_OUT)
  console.log(`generated ${ICON_OUT}`)

  copyFileSync(LOGO_SOURCE, OG_LOGO_OUT)
  console.log(`copied ${LOGO_SOURCE} → ${OG_LOGO_OUT}`)
}

main().catch((error: unknown) => {
  console.error('failed to generate icon:', error)
  process.exit(1)
})
