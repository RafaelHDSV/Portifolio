import {
  ChatCircleIcon,
  LinkedinLogoIcon,
  PlayIcon,
  ShareNetworkIcon,
  ThumbsUpIcon
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button/Button'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import { type LinkedInPost, useLinkedInPosts } from '../../hooks/useLinkedInPosts'
import {
  getMediaProxyUrl,
  getPostImages,
  getPostVideoUrl
} from '../../utils/linkedinPostMedia'
import { renderLinkedInPostText } from '../../utils/linkedinPostText'
import styles from './LinkedInPosts.module.scss'

const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/rafael-vieira1720/'
const LINKEDIN_ACTIVITY_URL =
  'https://www.linkedin.com/in/rafael-vieira1720/recent-activity/all/'
const AUTHOR_NAME = 'Rafael Vieira'
const AUTHOR_AVATAR = '/og/avatar.jpg'
const TEXT_COLLAPSE_LIMIT = 360

function formatDate (date: string | null, locale: string): string | null {
  if (!date) return null

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return null

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(parsed)
}

function formatRelativeDate (date: string | null, locale: string): string | null {
  if (!date) return null

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return null

  const diffMs = Date.now() - parsed.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day')
  }

  if (diffDays < 7) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
      -diffDays,
      'day'
    )
  }

  return formatDate(date, locale)
}

interface PostMediaProps {
  post: LinkedInPost
}

function PostMedia ({ post }: PostMediaProps) {
  const { t } = useTranslation()
  const [imageFailed, setImageFailed] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const images = getPostImages(post.midiaUrls, post.tipoMidia)
  const videoUrl = post.tipoMidia === 'video' ? getPostVideoUrl(post.midiaUrls) : null
  const posterUrl = images[0]

  if (videoUrl && !videoFailed) {
    return (
      <div className={styles.media}>
        <video
          className={styles.video}
          controls
          preload='metadata'
          poster={posterUrl ? getMediaProxyUrl(posterUrl) : undefined}
          aria-label={t('linkedinPosts.videoLabel')}
          onError={() => setVideoFailed(true)}
        >
          <source src={getMediaProxyUrl(videoUrl)} type='video/mp4' />
        </video>
      </div>
    )
  }

  if (videoUrl && videoFailed && posterUrl && !imageFailed) {
    return (
      <a
        href={post.url}
        target='_blank'
        rel='noreferrer'
        className={`${styles.media} ${styles.mediaFallback}`}
        aria-label={t('linkedinPosts.watchOnLinkedIn')}
      >
        <img
          src={getMediaProxyUrl(posterUrl)}
          alt={t('linkedinPosts.mediaAlt')}
          loading='lazy'
          onError={() => setImageFailed(true)}
        />
        <span className={styles.playOverlay}>
          <PlayIcon size={28} weight='fill' aria-hidden='true' />
        </span>
      </a>
    )
  }

  if (images.length === 0 || imageFailed) return null

  return (
    <div
      className={`${styles.media} ${images.length > 1 ? styles.mediaGrid : ''}`}
      data-count={Math.min(images.length, 2)}
    >
      {images.slice(0, 2).map((url) => (
        <a
          key={url}
          href={post.url}
          target='_blank'
          rel='noreferrer'
          className={styles.mediaLink}
          aria-label={t('linkedinPosts.openPost', { name: AUTHOR_NAME })}
        >
          <img
            src={getMediaProxyUrl(url)}
            alt={t('linkedinPosts.mediaAlt')}
            loading='lazy'
            onError={() => setImageFailed(true)}
          />
        </a>
      ))}
    </div>
  )
}

interface PostCardProps {
  post: LinkedInPost
  locale: string
}

function PostCard ({ post, locale }: PostCardProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const role = t('linkedinPosts.role')
  const shouldCollapse = post.texto.length > TEXT_COLLAPSE_LIMIT
  const relativeDate = formatRelativeDate(post.publicadoEm, locale)
  const absoluteDate = formatDate(post.publicadoEm, locale)
  const reactions = post.reacoesCount ?? 0
  const showReactions = reactions > 0

  return (
    <article className={styles.post}>
      <header className={styles.postHeader}>
        <a href={LINKEDIN_PROFILE_URL} target='_blank' rel='noreferrer'>
          <img
            className={styles.avatar}
            src={AUTHOR_AVATAR}
            alt={AUTHOR_NAME}
            width={48}
            height={48}
            loading='lazy'
          />
        </a>

        <div className={styles.authorMeta}>
          <a
            className={styles.authorName}
            href={LINKEDIN_PROFILE_URL}
            target='_blank'
            rel='noreferrer'
          >
            {AUTHOR_NAME}
          </a>
          <span className={styles.authorRole} title={role}>
            {role}
          </span>
          {relativeDate && (
            <time
              className={styles.postDate}
              dateTime={post.publicadoEm ?? undefined}
              title={absoluteDate ?? undefined}
            >
              {relativeDate}
            </time>
          )}
        </div>

        <a
          className={styles.linkedinBadge}
          href={post.url}
          target='_blank'
          rel='noreferrer'
          aria-label={t('linkedinPosts.readPost')}
        >
          <LinkedinLogoIcon size={20} weight='fill' aria-hidden='true' />
        </a>
      </header>

      <div className={styles.postBody}>
        <div
          className={`${styles.text} ${shouldCollapse && !expanded ? styles.textCollapsed : ''}`}
        >
          {renderLinkedInPostText(post.texto, {
            hashtagClassName: styles.hashtag,
            linkClassName: styles.inlineLink
          })}
        </div>

        {shouldCollapse && (
          <button
            type='button'
            className={styles.toggleText}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? t('linkedinPosts.seeLess') : t('linkedinPosts.seeMore')}
          </button>
        )}
      </div>

      <PostMedia post={post} />

      {showReactions && (
        <div className={styles.reactionsSummary}>
          <span className={styles.reactionIcon} aria-hidden='true'>
            <ThumbsUpIcon size={12} weight='fill' />
          </span>
          <span>{t('linkedinPosts.reactions', { count: reactions })}</span>
        </div>
      )}

      <div className={styles.actions}>
        <a href={post.url} target='_blank' rel='noreferrer' className={styles.action}>
          <ThumbsUpIcon size={18} />
          <span>{t('linkedinPosts.like')}</span>
          {showReactions && <span className={styles.actionCount}>{reactions}</span>}
        </a>
        <a href={post.url} target='_blank' rel='noreferrer' className={styles.action}>
          <ChatCircleIcon size={18} />
          <span>{t('linkedinPosts.comment')}</span>
        </a>
        <a href={post.url} target='_blank' rel='noreferrer' className={styles.action}>
          <ShareNetworkIcon size={18} />
          <span>{t('linkedinPosts.share')}</span>
        </a>
      </div>
    </article>
  )
}

export default function LinkedInPosts () {
  const { t, i18n } = useTranslation()
  const { posts, loading, error } = useLinkedInPosts()
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US'
  const hasPosts = posts.length > 0

  return (
    <Fade triggerOnce>
      <section id='linkedin-posts' className={`mainContainer ${styles.section}`}>
        <Container className={styles.content}>
          <SectionTitle
            title={t('linkedinPosts.title')}
            subtitle={t('linkedinPosts.subtitle')}
          />

          {loading && (
            <div className={styles.feed} aria-label={t('linkedinPosts.loading')}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={styles.skeleton} aria-hidden='true'>
                  <div className={styles.skeletonHeader} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonMedia} />
                  <div className={styles.skeletonFooter} />
                </div>
              ))}
            </div>
          )}

          {!loading && hasPosts && (
            <>
              <div className={styles.feed}>
                {posts.map((post) => (
                  <PostCard key={post.postId} post={post} locale={locale} />
                ))}
              </div>

              <div className={styles.loadMoreWrap}>
                <Button variant='secondary' href={LINKEDIN_ACTIVITY_URL}>
                  {t('linkedinPosts.loadMore')}
                </Button>
              </div>
            </>
          )}

          {!loading && (!hasPosts || error) && (
            <div className={styles.emptyState} role='status'>
              <p>{t(error ? 'linkedinPosts.error' : 'linkedinPosts.empty')}</p>
              <a href={LINKEDIN_PROFILE_URL} target='_blank' rel='noreferrer'>
                {t('linkedinPosts.viewProfile')}
              </a>
            </div>
          )}
        </Container>
      </section>
    </Fade>
  )
}
