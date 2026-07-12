import type { IncomingMessage, ServerResponse } from 'node:http'

const PROFILE_USERNAME = 'rafael-vieira1720'
const DEFAULT_LIMIT = 3
const MAX_LIMIT = 5

interface PostRow {
  post_id: string
  profile_username: string
  texto: string
  url: string
  publicado_em: string | null
  tipo_midia: string
  midia_urls: string[] | null
  reacoes_count: number | null
}

function getLimit (url: string | undefined): number {
  const value = new URL(url ?? '/', 'https://portfolio.local').searchParams.get('limit')
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_LIMIT
  return Math.min(parsed, MAX_LIMIT)
}

function sendJson (res: ServerResponse, statusCode: number, body: unknown): void {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
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

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    sendJson(res, 500, { error: 'supabase_not_configured' })
    return
  }

  const query = new URLSearchParams({
    select: 'post_id,profile_username,texto,url,publicado_em,tipo_midia,midia_urls,reacoes_count',
    profile_username: `eq.${PROFILE_USERNAME}`,
    order: 'publicado_em.desc.nullslast',
    limit: String(getLimit(req.url))
  })

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/linkedin_posts_posts?${query.toString()}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Supabase respondeu ${response.status}`)
    }

    const rows = (await response.json()) as PostRow[]
    sendJson(res, 200, {
      profileUsername: PROFILE_USERNAME,
      posts: rows.map((post) => ({
        postId: post.post_id,
        profileUsername: post.profile_username,
        texto: post.texto,
        url: post.url,
        publicadoEm: post.publicado_em,
        tipoMidia: post.tipo_midia,
        midiaUrls: post.midia_urls ?? [],
        reacoesCount: post.reacoes_count
      }))
    })
  } catch (error) {
    console.error('Falha ao consultar posts do LinkedIn', error)
    sendJson(res, 502, { error: 'linkedin_posts_unavailable' })
  }
}
