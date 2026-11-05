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

/** Score de qualidade: high-res > shrink_N; thumbnails (20/160) perdem. */
export function scoreLinkedInImageUrl (url: string): number {
  if (/image-high-res/i.test(url)) return 10_000
  const shrink = url.match(/shrink_(\d+)/i)
  if (shrink) return Number(shrink[1])
  if (/videocover|articleshare/i.test(url)) return 500
  return 100
}

/** Agrupa variantes do mesmo asset LinkedIn (dms/image/v2/{id}/…). */
export function linkedInImageAssetKey (url: string): string {
  const match = url.match(/\/dms\/image\/(?:v2\/)?([^/?#]+)\//i)
  if (match?.[1]) return match[1]
  return url
    .replace(/\?.*$/, '')
    .replace(/feedshare-(?:image-high-res|shrink_\d+)/gi, 'SIZE')
}

/**
 * Uma URL por asset, sempre a melhor resolucao disponivel.
 * Evita grade com shrink_20/160 pixelada ao lado de outra variante do mesmo post.
 */
export function pickBestImageUrls (urls: string[]): string[] {
  const bestByAsset = new Map<string, string>()

  for (const url of urls) {
    const key = linkedInImageAssetKey(url)
    const current = bestByAsset.get(key)
    if (!current || scoreLinkedInImageUrl(url) > scoreLinkedInImageUrl(current)) {
      bestByAsset.set(key, url)
    }
  }

  return [...bestByAsset.values()]
}

export function getPostImages (urls: string[], tipoMidia: string): string[] {
  const normalized = uniqueMediaUrls(urls)

  const images =
    tipoMidia === 'video'
      ? normalized.filter((url) => IMAGE_URL_PATTERN.test(url))
      : normalized.filter((url) => IMAGE_URL_PATTERN.test(url) && !VIDEO_URL_PATTERN.test(url))

  return pickBestImageUrls(images)
}

export function getPostVideoUrl (urls: string[]): string | null {
  const normalized = uniqueMediaUrls(urls)
  return normalized.find((url) => VIDEO_URL_PATTERN.test(url)) ?? null
}
