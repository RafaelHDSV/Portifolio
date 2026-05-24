import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
  href?: string
}

export default function Button ({
  variant = 'primary',
  children,
  className = '',
  href,
  ...props
}: ButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim()

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        download={href.endsWith('.pdf') ? true : undefined}
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
