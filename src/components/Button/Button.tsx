import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode
} from 'react'
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
  type = 'button',
  disabled,
  ...props
}: ButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim()

  if (href) {
    const isExternal = href.startsWith('http')
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>

    return (
      <a
        className={classes}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        download={download}
        {...anchorProps}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
