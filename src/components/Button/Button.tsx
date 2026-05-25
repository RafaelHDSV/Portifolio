import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
  href?: string
  download?: string | boolean
}

export default function Button ({
  variant = 'primary',
  children,
  className = '',
  href,
  download,
  ...props
}: ButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim()

  if (href) {
    const isExternal = href.startsWith('http')
    return (
      <a
        className={classes}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        download={download}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
