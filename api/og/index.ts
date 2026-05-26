import { ImageResponse } from '@vercel/og'
import type { ReactElement } from 'react'
import { getOgCopy, parseRequestLang } from './copy.js'
import { buildOgElement } from './template.js'

export default async function handler (request: Request) {
  const copy = getOgCopy(parseRequestLang(request))

  return new ImageResponse(buildOgElement(copy) as ReactElement, {
    width: 1200,
    height: 630,
    headers: {
      'Cache-Control':
        'public, max-age=86400, stale-while-revalidate=604800'
    }
  })
}
