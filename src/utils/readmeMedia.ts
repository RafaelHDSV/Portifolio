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

const NON_DEMO_PATTERNS = [
  /shields\.io/i,
  /badge/i,
  /opengraph\.githubassets\.com/i,
  /img\.shields\.io/i,
  /contributors/i,
  /avatar/i,
  /profile/i,
  /favicon/i,
  /github\.com\/[^/]+\/[^/]+\/blob\/main\/README/i
]

const DEMO_HINT_PATTERNS = [
  /user-attachments\/assets/i,
  /demo/i,
  /preview/i,
  /screenshot/i,
  /screen[_-]?shot/i,
  /showcase/i,
  /capture/i,
  /recording/i,
  /\/assets\//i,
  /\/docs\//i,
  /\/public\//i,
  /\/images\//i,
  /\/media\//i,
  /\/screens\//i,
  /desktop/i,
  /mobile/i,
  /main\.png/i,
  /mockup/i,
  /banner/i,
  /customizer/i,
  /full-project/i
]

/** Headers de secao onde READMEs costumam colocar previews (Screenshots, Images, etc.). */
const MEDIA_SECTION_HEADER =
  /#{1,6}\s+[^\n]*(?:screenshots?|(?:📷\s*)?images?|preview|demo|capturas|galeria)[^\n]*/i

export function isLikelyDemoMedia (url: string): boolean {
  const lower = url.toLowerCase()

  if (NON_DEMO_PATTERNS.some((pattern) => pattern.test(lower))) return false
  if (/\.svg(\?|$)/i.test(lower)) return false
  if (/(^|[/_-])logo([./-]|$)/i.test(lower)) return false
  if (/(^|[/_-])icon([./-]|$)/i.test(lower)) return false

  if (GIF_EXT.test(lower) || VIDEO_EXT.test(lower)) return true
  if (DEMO_HINT_PATTERNS.some((pattern) => pattern.test(lower))) return true

  return false
}

function isFallbackReadmeImage (url: string): boolean {
  const lower = url.toLowerCase()

  if (NON_DEMO_PATTERNS.some((pattern) => pattern.test(lower))) return false
  if (/\.svg(\?|$)/i.test(lower)) return false
  if (/(^|[/_-])logo([./-]|$)/i.test(lower)) return false
  if (/(^|[/_-])icon([./-]|$)/i.test(lower)) return false

  return (
    GIF_EXT.test(lower) ||
    VIDEO_EXT.test(lower) ||
    /\.(png|jpe?g|webp)(\?|$)/i.test(lower) ||
    lower.includes('user-attachments/assets')
  )
}

function pickBestReadmeMedia (candidates: ReadmeMedia[]): ReadmeMedia | null {
  if (candidates.length === 0) return null

  const video = candidates.find(
    (m) => m.type === 'video' && VIDEO_EXT.test(m.url)
  )
  if (video) {
    const poster = candidates.find((m) => m.type === 'image' || m.type === 'gif')
    return { ...video, poster: poster?.url }
  }

  const gif = candidates.find((m) => m.type === 'gif')
  if (gif) return gif

  return candidates.find((m) => m.type === 'image') ?? candidates[0]
}

function sliceUntilNextSection (content: string): string {
  const nextHeader = content.search(/\n#{1,6}\s+/)
  return nextHeader === -1 ? content : content.slice(0, nextHeader)
}

function extractMediaSection (content: string): string | null {
  const match = content.match(MEDIA_SECTION_HEADER)
  if (!match || match.index === undefined) return null

  const afterHeader = content.slice(match.index + match[0].length)
  return sliceUntilNextSection(afterHeader)
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
  const sectionOnly: ReadmeMedia[] = []
  const mediaSection = extractMediaSection(content)

  const collectFrom = (section: string, target: ReadmeMedia[]) => {
    const mdImg = /!\[[^\]]*]\(([^)]+)\)/g
    let match: RegExpExecArray | null
    while ((match = mdImg.exec(section)) !== null) {
      pushMedia(target, match[1], owner, repo)
    }

    const htmlImg = /<img[^>]+src=["']([^"']+)["']/gi
    while ((match = htmlImg.exec(section)) !== null) {
      pushMedia(target, match[1], owner, repo)
    }

    const videoSrc = /<video[^>]*>[\s\S]*?<source[^>]+src=["']([^"']+)["']/gi
    while ((match = videoSrc.exec(section)) !== null) {
      pushMedia(target, match[1], owner, repo)
    }

    const videoDirect = /<video[^>]+src=["']([^"']+)["']/gi
    while ((match = videoDirect.exec(section)) !== null) {
      pushMedia(target, match[1], owner, repo)
    }

    const mdLinkMedia = /\[[^\]]*]\(([^)]+\.(?:mp4|webm|gif|png|jpe?g|webp)[^)]*)\)/gi
    while ((match = mdLinkMedia.exec(section)) !== null) {
      pushMedia(target, match[1], owner, repo)
    }

    const mdVideoLink =
      /\[[^\]]*]\((https:\/\/github\.com\/user-attachments\/assets\/[^)]+)\)/gi
    while ((match = mdVideoLink.exec(section)) !== null) {
      pushMedia(target, match[1], owner, repo)
    }

    const assetsUrl = /https:\/\/github\.com\/user-attachments\/assets\/[a-f0-9-]+/gi
    while ((match = assetsUrl.exec(section)) !== null) {
      pushMedia(target, match[0], owner, repo)
    }
  }

  if (mediaSection) {
    collectFrom(mediaSection, sectionOnly)
  }
  collectFrom(content, found)

  if (found.length === 0) return null

  const pickFromList = (list: ReadmeMedia[]): ReadmeMedia | null => {
    if (list.length === 0) return null
    const demoCandidates = list.filter((m) => isLikelyDemoMedia(m.url))
    const picked = pickBestReadmeMedia(demoCandidates)
    if (picked) return picked
    return pickBestReadmeMedia(
      list.filter((m) => isFallbackReadmeImage(m.url))
    )
  }

  return pickFromList(sectionOnly) ?? pickFromList(found)
}

export function githubOpenGraphImage (owner: string, repo: string): string {
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`
}
