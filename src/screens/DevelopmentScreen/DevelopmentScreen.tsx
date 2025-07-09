import styles from './DevelopmentScreen.module.scss'

interface IDevelopmentScreenProps {
  devClickCount: number
  setDevClickCount: (count: number | ((prev: number) => number)) => void
}

export default function DevelopmentScreen({
  devClickCount,
  setDevClickCount
}: IDevelopmentScreenProps) {
  const isUnlocked = devClickCount >= 29

  const handleClick = () => setDevClickCount((prev) => prev + 1)

  const headlineText = isUnlocked ? '' : 'Obrigado por visitar meu '
  const clickedText = isUnlocked ? 'Parabéns!' : 'portfólio'

  return (
    <main className={styles.main}>
      <div className={styles.errorPage}>
        <img
          className={styles.leftAstronaut}
          src='./astronaut.png'
          alt='astronaut.png'
        />
        <img
          className={styles.rightAstronaut}
          src='./astronaut2.svg'
          alt='astronaut2.svg'
        />

        <div className={styles.errorText}>
          <h1>
            {headlineText}
            <b className={styles.devClickButton} onClick={handleClick}>
              {clickedText}
            </b>
          </h1>

          <p>
            {isUnlocked
              ? 'Você desbloqueou o modo de desenvolvimento!'
              : 'Este projeto ainda está em desenvolvimento. Fique atento para novidades em breve!'}
          </p>
        </div>
      </div>

      <div className={styles.bg}></div>
      <div className={styles.starField}>
        <div className={styles.layer}></div>
        <div className={styles.layer}></div>
        <div className={styles.layer}></div>
      </div>
    </main>
  )
}
