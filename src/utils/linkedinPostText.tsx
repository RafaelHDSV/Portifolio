import type { ReactNode } from 'react'

const TOKEN_PATTERN = /(https?:\/\/[^\s<>"']+|#[\p{L}\p{N}_]+)/giu
const EMOJI_BREAK_PATTERN = /([.!?…])(\p{Extended_Pictographic})/gu
const TRAILING_HASHTAGS_PATTERN = /#[\p{L}\p{N}_]+(?:\s+#[\p{L}\p{N}_]+)*$/u

function separateTrailingHashtags (text: string): string {
  const match = text.match(TRAILING_HASHTAGS_PATTERN)
  if (!match) return text

  const hashtagBlock = match[0]
  const content = text.slice(0, text.length - hashtagBlock.length).trimEnd()

  if (!content || content.endsWith('\n\n')) return text

  return `${content}\n\n${hashtagBlock}`
}

export function normalizeLinkedInText (text: string): string {
  return separateTrailingHashtags(
    text
      .replace(/\\"/g, '')
      .replace(EMOJI_BREAK_PATTERN, '$1\n\n$2')
      .replace(/\s*(→\s)/g, '\n$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

function trimUrlTrailingPunctuation (url: string): { href: string; trailing: string } {
  const match = url.match(/^(https?:\/\/[^\s]+?)([).,;:!?…"'»]+)?$/)

  if (!match) return { href: url, trailing: '' }

  return {
    href: match[1],
    trailing: match[2] ?? ''
  }
}

function renderLineTokens (
  line: string,
  options: RenderLinkedInPostTextOptions,
  keyPrefix: string
): ReactNode {
  return line.split(TOKEN_PATTERN).filter(Boolean).map((token, tokenIndex) => {
    const key = `${keyPrefix}-${tokenIndex}`

    if (token.startsWith('http')) {
      const { href, trailing } = trimUrlTrailingPunctuation(token)

      return (
        <span key={key}>
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className={options.linkClassName}
          >
            {href}
          </a>
          {trailing}
        </span>
      )
    }

    if (token.startsWith('#')) {
      return (
        <span key={key} className={options.hashtagClassName}>
          {token}
        </span>
      )
    }

    return <span key={key}>{token}</span>
  })
}

interface RenderLinkedInPostTextOptions {
  hashtagClassName?: string
  linkClassName?: string
}

export function renderLinkedInPostText (
  text: string,
  options: RenderLinkedInPostTextOptions = {}
): ReactNode {
  const paragraphs = normalizeLinkedInText(text).split(/\n{2,}/)

  return paragraphs.map((paragraph, paragraphIndex) => {
    const lines = paragraph.split('\n')

    return (
      <p key={`paragraph-${paragraphIndex}`} className='linkedin-post-paragraph'>
        {lines.map((line, lineIndex) => (
          <span key={`line-${paragraphIndex}-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            {renderLineTokens(line, options, `token-${paragraphIndex}-${lineIndex}`)}
          </span>
        ))}
      </p>
    )
  })
}
