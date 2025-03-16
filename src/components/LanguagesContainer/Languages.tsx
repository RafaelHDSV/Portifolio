import { useState } from 'react'
import { LanguagesData } from '../../constants/LanguagesData'
import styles from './Languages.module.scss'

export const LanguagesContainer = () => {
  const [languageActivity, setLanguageActivity] = useState(0)

  return (
    <div id={styles.languages} className={styles.mainContainer}>
      <h2 className={styles.titleContainer}>Linguagens e Tecnologias</h2>

      <main>
        <aside className={styles.info}>
          <h3>{LanguagesData[languageActivity].name}</h3>

          <article>{LanguagesData[languageActivity].description}</article>
        </aside>

        <aside className={styles.languages}>
          <div className={styles.languagesGrid}>
            {LanguagesData.map(language => (
              <span
                className={`${styles.languagesLogo} ${language.id === languageActivity ? styles.activity : ''}`}
                onClick={() => setLanguageActivity(language.id)}
              >
                {language.logo}
              </span>
            ))}
          </div>
        </aside>
      </main>
    </div>
  )
}
