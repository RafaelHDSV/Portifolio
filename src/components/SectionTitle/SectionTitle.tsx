import styles from './SectionTitle.module.scss'

interface SectionTitleProps {
  title: string
  subtitle?: string
}

export default function SectionTitle ({ title, subtitle }: SectionTitleProps) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}
