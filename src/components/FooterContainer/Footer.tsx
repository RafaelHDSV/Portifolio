import { Fade } from 'react-awesome-reveal'

export default function FooterContainer() {
  return (
    <Fade>
      <FooterContent />
    </Fade>
  )
}
function FooterContent() {
  return <footer>{`Copyright © ${new Date().getFullYear()} | Rafael Vieira. Todos os direitos reservados.`}</footer>
}
