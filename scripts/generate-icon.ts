import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import sharp from 'sharp'

const LOGO_SOURCE = 'src/assets/logo-rv-mark.png'
const OG_LOGO_OUT = 'public/og/logo-rv.png'
const CANVAS = 512
const MARK_RATIO = 0.58
const BG = { r: 10, g: 10, b: 11, alpha: 1 }

const ICON_OUTPUTS = [
  { path: 'public/icon.png', size: 512 },
  { path: 'public/icon-192.png', size: 192 },
  { path: 'public/icon-48.png', size: 48 },
  { path: 'public/apple-touch-icon.png', size: 180 }
] as const

async function buildLogoPng (canvasSize: number): Promise<Buffer> {
  if (!existsSync(LOGO_SOURCE)) {
    throw new Error(`logo source not found at ${LOGO_SOURCE}`)
  }

  const markSize = Math.round(canvasSize * MARK_RATIO)
  const markBuffer = await sharp(LOGO_SOURCE)
    .resize(markSize, markSize, { fit: 'contain' })
    .png()
    .toBuffer()

  return sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: BG
    }
  })
    .composite([{ input: markBuffer, gravity: 'center' }])
    .png()
    .toBuffer()
}

async function main (): Promise<void> {
  const base = await buildLogoPng(CANVAS)

  for (const { path, size } of ICON_OUTPUTS) {
    mkdirSync(dirname(path), { recursive: true })
    await sharp(base).resize(size, size).png().toFile(path)
    console.log(`generated ${path} (${size}x${size})`)
  }

  copyFileSync(LOGO_SOURCE, OG_LOGO_OUT)
  console.log(`copied ${LOGO_SOURCE} → ${OG_LOGO_OUT}`)
}

main().catch((error: unknown) => {
  console.error('failed to generate icon:', error)
  process.exit(1)
})
