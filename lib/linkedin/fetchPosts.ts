import { loadManualPosts } from './manualPosts'
import type { LinkedInPost } from './types'

export type { LinkedInPost } from './types'

function stripHtml (value: string): string {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

function truncate (text: string, max = 180): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

export function parseRssFeed (xml: string): LinkedInPost[] {
  const items: LinkedInPost[] = []
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []

  for (const block of itemBlocks) {
    const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''
    const link = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? ''
    const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ?? ''
    const description =
      block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ??
      block.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1] ??
      ''

    const cleanTitle = stripHtml(title)
    const cleanExcerpt = truncate(stripHtml(description))

    if (!link) continue

    items.push({
      id: link,
      title: cleanTitle || cleanExcerpt.slice(0, 60) || 'LinkedIn',
      excerpt: cleanExcerpt,
      url: link,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
    })
  }

  return items.slice(0, 5)
}

async function fetchFromRss (rssUrl: string): Promise<LinkedInPost[]> {
  const response = await fetch(rssUrl, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' }
  })

  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status}`)
  }

  const xml = await response.text()
  return parseRssFeed(xml)
}

async function fetchFromLinkedInApi (
  token: string,
  authorUrn: string
): Promise<LinkedInPost[]> {
  const author = `List(${authorUrn})`
  const url = `https://api.linkedin.com/rest/posts?q=author&author=${encodeURIComponent(author)}&count=5&sortBy=LAST_MODIFIED`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'LinkedIn-Version': '202405',
      'X-Restli-Protocol-Version': '2.0.0'
    }
  })

  if (!response.ok) {
    throw new Error(`LinkedIn API failed: ${response.status}`)
  }

  const data = (await response.json()) as {
    elements?: Array<{
      id?: string
      commentary?: string
      content?: { article?: { title?: string; description?: string; source?: string } }
      createdAt?: number
    }>
  }

  return (data.elements ?? []).map((post) => {
    const article = post.content?.article
    const commentary = post.commentary ?? article?.description ?? ''
    const title = article?.title ?? truncate(commentary, 80)
    const link = article?.source ?? `https://www.linkedin.com/feed/update/${post.id ?? ''}`

    return {
      id: post.id ?? link,
      title,
      excerpt: truncate(commentary || article?.description || title),
      url: link,
      publishedAt: post.createdAt
        ? new Date(post.createdAt).toISOString()
        : new Date().toISOString()
    }
  })
}

export async function fetchLinkedInPosts (): Promise<LinkedInPost[]> {
  const manual = loadManualPosts()
  if (manual.length > 0) return manual

  const rssUrl = process.env.LINKEDIN_RSS_URL
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  const authorUrn = process.env.LINKEDIN_MEMBER_URN

  if (token && authorUrn) {
    try {
      const posts = await fetchFromLinkedInApi(token, authorUrn)
      if (posts.length > 0) return posts
    } catch (err) {
      console.error('LinkedIn API error:', err)
    }
  }

  if (rssUrl) {
    return fetchFromRss(rssUrl)
  }

  return []
}
