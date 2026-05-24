import { ReactNode } from 'react'
import styles from './Container.module.scss'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export default function Container ({
  children,
  className = '',
  as: Tag = 'div'
}: ContainerProps) {
  return (
    <Tag className={`${styles.container} ${className}`.trim()}>
      {children}
    </Tag>
  )
}
