import styles from '../About.module.scss'

interface IUserInfoItem {
  icon: React.ElementType
  label: string
  value: string | number
}

export default function UserInfoItem ({
  icon: Icon,
  label,
  value
}: IUserInfoItem) {
  return (
    <div className={styles.item}>
      <Icon className={styles.icon} size={20} weight='duotone' aria-hidden='true' />
      <div className={styles.itemText}>
        <span className={styles.itemLabel}>{label}</span>
        <span className={styles.itemValue}>{value}</span>
      </div>
    </div>
  )
}
