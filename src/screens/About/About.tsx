import {
  BuildingOfficeIcon,
  CalendarDotsIcon,
  FilesIcon,
  GithubLogoIcon,
  LockSimpleIcon,
  MapPinIcon,
  TrayArrowDownIcon,
  TrayArrowUpIcon
} from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button/Button'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import { CV_DOWNLOAD_NAME, CV_URL } from '../../constants/cv'
import useGetMe from '../../hooks/useGetMe'
import styles from './About.module.scss'
import UserInfoItem from './components/UserInfoItem'

function AboutSkeleton () {
  return (
    <Container className={styles.skeleton}>
      <div className={styles.skeletonAvatar} aria-hidden='true' />
      <div className={styles.skeletonLines}>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
      </div>
    </Container>
  )
}

function AboutContent () {
  const { t } = useTranslation()
  const { user, loading } = useGetMe()

  if (loading) return <AboutSkeleton />
  if (!user) return null

  return (
    <Container className={styles.layout}>
      <div className={styles.avatar}>
        <img
          src={user.avatar_url}
          alt={`Avatar de ${user.name}`}
          loading='lazy'
          width={180}
          height={180}
        />
      </div>

      <div className={styles.content}>
        <div>
          <h3>
            {user.name} ({user.login})
          </h3>
          <p className={styles.bio}>{t('about.bio')}</p>
        </div>

        <div className={styles.highlights}>
          <span>{t('about.highlights.role')}</span>
          <span>{t('about.highlights.focus')}</span>
        </div>

        <div className={styles.info}>
          <UserInfoItem
            icon={BuildingOfficeIcon}
            label={t('about.workingAt')}
            value={user.company}
          />
          <UserInfoItem
            icon={MapPinIcon}
            label={t('about.location')}
            value={user.location}
          />
          <UserInfoItem
            icon={TrayArrowDownIcon}
            label={t('about.followers')}
            value={user.followers}
          />
          <UserInfoItem
            icon={TrayArrowUpIcon}
            label={t('about.following')}
            value={user.following}
          />
          <UserInfoItem
            icon={FilesIcon}
            label={t('about.publicRepos')}
            value={user.public_repos}
          />
          {user.total_private_repos !== undefined && user.total_private_repos > 0 && (
            <UserInfoItem
              icon={LockSimpleIcon}
              label={t('about.privateRepos')}
              value={user.total_private_repos}
            />
          )}
          <UserInfoItem
            icon={CalendarDotsIcon}
            label={t('about.since')}
            value={dayjs(user.created_at).format('DD/MM/YYYY')}
          />
        </div>

        <div className={styles.actions}>
          <Button
            href={CV_URL}
            variant='primary'
            download={CV_DOWNLOAD_NAME}
          >
            {t('about.downloadCv')}
          </Button>
          <Button
            href={`https://github.com/${user.login}`}
            variant='secondary'
          >
            <GithubLogoIcon size={18} weight='bold' />
            {t('about.viewGithub')}
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default function About () {
  const { t } = useTranslation()

  return (
    <Fade triggerOnce>
      <section id='about' className={`mainContainer ${styles.about}`}>
        <Container>
          <SectionTitle
            title={t('about.title')}
            subtitle={t('about.subtitle')}
          />
          <AboutContent />
        </Container>
      </section>
    </Fade>
  )
}
