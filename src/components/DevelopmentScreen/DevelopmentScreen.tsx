import styles from './DevelopmentScreen.module.scss'

interface IDevelopmentScreenProps {
  clickCount: (value: (prev: number) => number) => void
}

export default function DevelopmentScreen({ clickCount }: IDevelopmentScreenProps) {
  return (
    <main className={styles.main}>
      <div className={styles.errorPage}>
        <img className={styles.leftAstronaut} src='./astronaut.png' alt='astronaut.png' />
        <img className={styles.rightAstronaut} src='./astronaut2.svg' alt='astronaut2.svg' />

        <div className={styles.errorText}>
          <h1>
            Obrigado por visitar meu <b onClick={() => clickCount(prev => prev + 1)}>portfólio</b>!
          </h1>
          <p>Este projeto ainda está em desenvolvimento. Fique atento para novidades em breve!</p>
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
