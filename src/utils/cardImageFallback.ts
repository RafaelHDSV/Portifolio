export type ImageFallbackStage = 'primary' | 'placeholder'

export function getPrimaryImageUrl (input: {
  image: string
  media?: { type: string; url: string }
}): string {
  if (input.media?.type === 'gif' || input.media?.type === 'image') {
    return input.media.url || input.image
  }
  return input.image
}

export function nextFallbackStage (): ImageFallbackStage {
  return 'placeholder'
}

export function resolveCardImageDisplay (
  stage: ImageFallbackStage,
  primaryUrl: string
): { src: string | null } {
  if (stage === 'placeholder' || !primaryUrl) {
    return { src: null }
  }

  return { src: primaryUrl }
}
