import styles from '../About.module.scss'

interface IUserInfoItem {
  icon: React.ElementType
  label: string
  value: string | number
}

export default function UserInfoItem({
  icon: Icon,
  label,
  value
}: IUserInfoItem) {
  return (
    <div className={styles.item}>
      <Icon className={styles.icon} size={22} weight='light' />
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  )
}
