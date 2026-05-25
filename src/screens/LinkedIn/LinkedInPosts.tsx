import { ArrowSquareOutIcon } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import { FaLinkedin } from 'react-icons/fa'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import { useLinkedInContext } from '../../context/useLinkedInContext'
import styles from './LinkedInPosts.module.scss'

export default function LinkedInPosts () {
  const { t, i18n } = useTranslation()
  const { posts, loading, hasPosts } = useLinkedInContext()

  if (!loading && !hasPosts) return null

  const dateLocale = i18n.language.startsWith('pt') ? 'pt-br' : 'en'

  return (
    <Fade triggerOnce>
      <section id='linkedin' className={`mainContainer ${styles.section}`}>
        <Container>
          <SectionTitle
            title={t('linkedin.title')}
            subtitle={t('linkedin.subtitle')}
          />

          {loading ? (
            <div className={styles.skeletonList} aria-hidden='true'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : (
            <ul className={styles.list}>
              {posts.map((post) => (
                <li key={post.id}>
                  <a
                    className={styles.card}
                    href={post.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <div className={styles.cardHeader}>
                      <FaLinkedin size={18} aria-hidden='true' />
                      <time dateTime={post.publishedAt}>
                        {dayjs(post.publishedAt).locale(dateLocale).format('DD MMM YYYY')}
                      </time>
                    </div>
                    <h3>{post.title}</h3>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <span className={styles.linkHint}>
                      {t('linkedin.readMore')}
                      <ArrowSquareOutIcon size={14} weight='bold' />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <a
            className={styles.profileLink}
            href='https://www.linkedin.com/in/rafael-vieira1720/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaLinkedin />
            {t('linkedin.viewProfile')}
          </a>
        </Container>
      </section>
    </Fade>
  )
}
