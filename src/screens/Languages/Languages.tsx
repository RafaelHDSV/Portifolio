import { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { LanguagesData } from '../../constants/LanguagesData'
import styles from './Languages.module.scss'

export default function Languages() {
  return (
    <Fade>
      <LanguagesContent />
    </Fade>
  )
}

function LanguagesContent() {
  const [languageActivity, setLanguageActivity] = useState(0)

  return (
    <div
      id='languages'
      className={`mainContainer ${styles.languagesContainer}`}
    >
      <h2 className='titleContainer'>Linguagens e Tecnologias</h2>

      <main>
        <aside className={styles.info}>
          <h3>{LanguagesData[languageActivity].name}</h3>

          <article>{LanguagesData[languageActivity].description}</article>
        </aside>

        <aside className={styles.languages}>
          <div className={styles.languagesGrid}>
            {LanguagesData.map((language) => (
              <span
                key={language.id}
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
