export type ImageFallbackStage = 'primary' | 'og' | 'placeholder'

export function getPrimaryImageUrl (input: {
  image: string
  media?: { type: string; url: string }
}): string {
  if (input.media?.type === 'gif') return input.media.url
  return input.image
}

export function nextFallbackStage (
  stage: ImageFallbackStage,
  primaryUrl: string,
  ogUrl: string
): ImageFallbackStage {
  if (stage === 'primary') {
    if (ogUrl && primaryUrl !== ogUrl) return 'og'
    return 'placeholder'
  }

  return 'placeholder'
}

export function resolveCardImageDisplay (
  stage: ImageFallbackStage,
  primaryUrl: string,
  ogUrl: string
): { src: string | null; usesGithubPreviewUx: boolean } {
  if (stage === 'placeholder') {
    return { src: null, usesGithubPreviewUx: Boolean(ogUrl) }
  }

  if (stage === 'og' && ogUrl) {
    return { src: ogUrl, usesGithubPreviewUx: true }
  }

  return {
    src: primaryUrl || null,
    usesGithubPreviewUx: false
  }
}

export function shouldShowGithubPreviewCard (
  projectUsesGithubPreview: boolean | undefined,
  stage: ImageFallbackStage
): boolean {
  return Boolean(projectUsesGithubPreview) || stage === 'og'
}
