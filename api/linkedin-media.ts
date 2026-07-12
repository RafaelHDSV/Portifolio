import type { IncomingMessage, ServerResponse } from 'node:http'

const ALLOWED_HOSTS = new Set(['media.licdn.com', 'dms.licdn.com'])

function isAllowedMediaUrl (value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' && ALLOWED_HOSTS.has(parsed.hostname)
  } catch {
    return false
  }
}

function sendJson (res: ServerResponse, statusCode: number, body: unknown): void {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

export default async function handler (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    sendJson(res, 405, { error: 'method_not_allowed' })
    return
  }

  const mediaUrl = new URL(req.url ?? '/', 'https://portfolio.local').searchParams.get('url')

  if (!mediaUrl || !isAllowedMediaUrl(mediaUrl)) {
    sendJson(res, 400, { error: 'invalid_media_url' })
    return
  }

  try {
    const upstream = await fetch(mediaUrl, {
      headers: {
        Referer: 'https://www.linkedin.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!upstream.ok) {
      res.statusCode = upstream.status
      res.end()
      return
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'
    const buffer = Buffer.from(await upstream.arrayBuffer())

    res.statusCode = 200
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    res.end(buffer)
  } catch (error) {
    console.error('Falha ao buscar midia do LinkedIn', error)
    sendJson(res, 502, { error: 'linkedin_media_unavailable' })
  }
}
