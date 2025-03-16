import { useState } from 'react'
import styles from '../Project.module.scss'

interface ProjectProps {
  key: string
  languages: {
    name: string
    logo: JSX.Element
  }[]
}

export const LanguagesContainer = (props: ProjectProps) => {
  const [languageVisible, setLanguageVisible] = useState<string | null>()
  const [keyVisible, setKeyVisible] = useState<string | null>()

  return (
    <div className={styles.languagesContainer}>
      {props.languages.map(language => (
        <div className={styles.singleLanguageContainer}>
          <span
            className={styles.language}
            key={Math.random()}
            style={{
              color: `var(--${language.name})`
            }}
            onMouseEnter={() => {
              setLanguageVisible(language.name)
              setKeyVisible(props.key)
            }}
            onMouseLeave={() => {
              setLanguageVisible(null)
              setKeyVisible(null)
            }}
          >
            {language.logo}
          </span>

          {language.name === languageVisible && props.key === keyVisible && (
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
