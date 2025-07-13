import { useState } from 'react'
import styles from '../Project.module.scss'

interface IProjectProps {
  projectKey: string
  languages: {
    name: string
    logo: JSX.Element
  }[]
}

export default function LanguagesOptions({
  projectKey,
  languages
}: IProjectProps) {
  const [languageVisible, setLanguageVisible] = useState<string | null>()
  const [keyVisible, setKeyVisible] = useState<string | null>()

  return (
    <div className={styles.languages}>
      {languages.map((language, idx) => (
        <div key={idx} className={styles.singleLanguage}>
          <span
            className={styles.language}
            key={Math.random()}
            style={{
              color: `var(--${language.name})`
            }}
            onMouseEnter={() => {
              setLanguageVisible(language.name)
              setKeyVisible(projectKey)
            }}
            onMouseLeave={() => {
              setLanguageVisible(null)
              setKeyVisible(null)
            }}
          >
            {language.logo}
          </span>

          {language.name === languageVisible && projectKey === keyVisible && (
            <>
              <span className={styles.triangle}></span>
              <span className={styles.languageName}>{language.name}</span>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
