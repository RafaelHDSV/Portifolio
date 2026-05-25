import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import {
  emailJsPublicKey,
  emailJsServiceId,
  emailJsTemplateId
} from '../../utils/environment'
import Button from '../Button/Button'
import styles from './ContactForm.module.scss'
import emailjs from '@emailjs/browser'
import { FormEvent } from 'react'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

interface ContactFormProps {
  onSuccess?: () => void
}

function containsVieira (value: string): boolean {
  return value.toLowerCase().includes('vieira')
}

export default function ContactForm ({ onSuccess }: ContactFormProps) {
  const { t } = useTranslation()
  const { triggerVieiraLaunch } = useEasterEgg()
  const [status, setStatus] = useState<FormStatus>('idle')
  const [vieiraUnlocked, setVieiraUnlocked] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') ?? '')
    const message = String(formData.get('message') ?? '')

    if (containsVieira(email) || containsVieira(message)) {
      triggerVieiraLaunch()
      setVieiraUnlocked(true)
    }

    if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
      setStatus('error')
      return
    }

    setStatus('sending')

    try {
      await emailjs.sendForm(
        emailJsServiceId,
        emailJsTemplateId,
        form,
        { publicKey: emailJsPublicKey }
      )
      setStatus('success')
      form.reset()
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  const successMessage = vieiraUnlocked
    ? t('contact.form.successVieira')
    : t('contact.form.success')

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor='contact-name'>{t('contact.form.name')}</label>
        <input
          id='contact-name'
          name='from_name'
          type='text'
          required
          autoComplete='name'
        />
      </div>

      <div className={styles.field}>
        <label htmlFor='contact-email'>{t('contact.form.email')}</label>
        <input
          id='contact-email'
          name='email'
          type='email'
          required
          autoComplete='email'
        />
      </div>

      <div className={styles.field}>
        <label htmlFor='contact-message'>{t('contact.form.message')}</label>
        <textarea id='contact-message' name='message' required rows={5} />
      </div>

      {status === 'success' && (
        <p className={`${styles.feedback} ${styles.success}`} role='status'>
          {successMessage}
        </p>
      )}

      {status === 'error' && (
        <p className={`${styles.feedback} ${styles.error}`} role='alert'>
          {t('contact.form.error')}
        </p>
      )}

      <Button type='submit' variant='primary' disabled={status === 'sending'}>
        {status === 'sending'
          ? t('contact.form.sending')
          : t('contact.form.send')}
      </Button>
    </form>
  )
}
