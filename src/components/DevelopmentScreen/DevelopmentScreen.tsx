import styles from '../../App.module.scss'

interface IDevelopmentScreenProps {
  setDevClickCount: (value: (prev: number) => number) => void
}

export default function DevelopmentScreen({ setDevClickCount }: IDevelopmentScreenProps) {
  return (
    <div className={styles.loader} onClick={() => setDevClickCount(prev => prev + 1)}>
      <h1>Obrigado por acessar o meu projeto!</h1>
      <p>Porém este projeto ainda está em desenvolvimento. Aguarde até a finalização do projeto</p>
    </div>
  )
}
