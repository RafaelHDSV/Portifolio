import styles from './Tooltip.module.scss'

interface ITooltipProps {
  text: string
  children: React.ReactNode
}

export default function Tooltip({ text, children }: ITooltipProps) {
  if (!text || !children) return

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltiptext}>{text}</span>
      {children}
    </div>
  )
}
