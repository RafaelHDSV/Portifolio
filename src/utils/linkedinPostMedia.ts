const IMAGE_URL_PATTERN = /dms\/image|feedshare|videocover/i
const VIDEO_URL_PATTERN = /\.mp4|\/playlist\/vid\//i

export function sanitizeMediaUrl (url: string): string {
  return url
    .trim()
    .replace(/\\"/g, '')
    .replace(/"/g, '')
    .replace(/^['"]+|['"]+$/g, '')
}

export function getMediaProxyUrl (url: string): string {
  return `/api/linkedin-media?url=${encodeURIComponent(sanitizeMediaUrl(url))}`
}

export function uniqueMediaUrls (urls: string[] | null | undefined): string[] {
  if (!urls?.length) return []

  const seen = new Set<string>()

  return urls
    .map(sanitizeMediaUrl)
    .filter((url) => {
      if (!url.startsWith('http') || seen.has(url)) return false
      seen.add(url)
      return true
    })
}

export function getPostImages (urls: string[], tipoMidia: string): string[] {
  const normalized = uniqueMediaUrls(urls)

  if (tipoMidia === 'video') {
    return normalized.filter((url) => IMAGE_URL_PATTERN.test(url))
  }

  return normalized.filter((url) => IMAGE_URL_PATTERN.test(url) && !VIDEO_URL_PATTERN.test(url))
}

export function getPostVideoUrl (urls: string[]): string | null {
  const normalized = uniqueMediaUrls(urls)
  return normalized.find((url) => VIDEO_URL_PATTERN.test(url)) ?? null
}
