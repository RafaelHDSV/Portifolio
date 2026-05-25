export type ReadmeMediaType = 'image' | 'gif' | 'video'

export interface ReadmeMedia {
  type: ReadmeMediaType
  url: string
  poster?: string
}

const GIF_EXT = /\.gif(\?|$)/i
const VIDEO_EXT = /\.(mp4|webm|mov)(\?|$)/i

function resolveUrl (raw: string, owner: string, repo: string): string {
  const trimmed = raw.trim().replace(/^["']|["']$/g, '')

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }

  const path = trimmed.replace(/^\.\//, '').replace(/^\//, '')
  return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`
}

function classifyUrl (url: string): ReadmeMediaType {
  if (GIF_EXT.test(url)) return 'gif'
  if (VIDEO_EXT.test(url)) return 'video'
  if (/\.(png|jpe?g|webp|svg)(\?|$)/i.test(url)) return 'image'

  if (url.includes('user-attachments/assets')) {
    return 'image'
  }

  return 'image'
}

function pushMedia (
  list: ReadmeMedia[],
  url: string,
  owner: string,
  repo: string,
  poster?: string
) {
  if (!url || url.includes('shields.io') || url.includes('badge')) return

  let resolved = url.trim().replace(/^["']|["']$/g, '')

  if (resolved.startsWith('//')) resolved = `https:${resolved}`

  if (
    !resolved.startsWith('http') &&
    !resolved.includes('user-attachments/assets')
  ) {
    resolved = resolveUrl(resolved, owner, repo)
  }

  const type = classifyUrl(resolved)

  if (list.some((m) => m.url === resolved)) return

  list.push({
    type,
    url: resolved,
    poster: poster ? resolveUrl(poster, owner, repo) : undefined
  })
}

export function parseReadmeMedia (
  content: string,
  owner: string,
  repo: string
): ReadmeMedia | null {
  const found: ReadmeMedia[] = []

  const mdImg = /!\[[^\]]*]\(([^)]+)\)/g
  let match: RegExpExecArray | null
  while ((match = mdImg.exec(content)) !== null) {
    pushMedia(found, match[1], owner, repo)
  }

  const htmlImg = /<img[^>]+src=["']([^"']+)["']/gi
  while ((match = htmlImg.exec(content)) !== null) {
    pushMedia(found, match[1], owner, repo)
  }

  const videoSrc = /<video[^>]*>[\s\S]*?<source[^>]+src=["']([^"']+)["']/gi
  while ((match = videoSrc.exec(content)) !== null) {
    pushMedia(found, match[1], owner, repo)
  }

  const videoDirect = /<video[^>]+src=["']([^"']+)["']/gi
  while ((match = videoDirect.exec(content)) !== null) {
    pushMedia(found, match[1], owner, repo)
  }

  const mdLinkMedia = /\[[^\]]*]\(([^)]+\.(?:mp4|webm|gif|png|jpe?g|webp)[^)]*)\)/gi
  while ((match = mdLinkMedia.exec(content)) !== null) {
    pushMedia(found, match[1], owner, repo)
  }

  const mdVideoLink = /\[[^\]]*]\((https:\/\/github\.com\/user-attachments\/assets\/[^)]+)\)/gi
  while ((match = mdVideoLink.exec(content)) !== null) {
    pushMedia(found, match[1], owner, repo)
  }

  const assetsUrl = /https:\/\/github\.com\/user-attachments\/assets\/[a-f0-9-]+/gi
  while ((match = assetsUrl.exec(content)) !== null) {
    pushMedia(found, match[0], owner, repo)
  }

  if (found.length === 0) return null

  const video = found.find(
    (m) => m.type === 'video' && VIDEO_EXT.test(m.url)
  )
  if (video) {
    const poster = found.find((m) => m.type === 'image' || m.type === 'gif')
    return { ...video, poster: poster?.url }
  }

  const gif = found.find((m) => m.type === 'gif')
  if (gif) return gif

  return found.find((m) => m.type === 'image') ?? found[0]
}

export function githubOpenGraphImage (owner: string, repo: string): string {
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`
}
