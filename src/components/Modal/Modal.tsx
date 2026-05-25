import { XIcon } from '@phosphor-icons/react'
import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal ({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.overlay} role='presentation'>
      <button
        type='button'
        className={styles.backdrop}
        onClick={onClose}
        aria-label='Fechar'
      />
      <div
        ref={dialogRef}
        className={styles.dialog}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
      >
        <div className={styles.header}>
          <h2 id='modal-title'>{title}</h2>
          <button
            type='button'
            className={styles.close}
            onClick={onClose}
            aria-label='Fechar'
          >
            <XIcon size={22} weight='bold' />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
