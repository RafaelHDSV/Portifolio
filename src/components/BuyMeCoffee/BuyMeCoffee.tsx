import { useEffect } from 'react'
import { useRecruiterMode } from '../../context/useRecruiterMode'

const SCRIPT_ID = 'bmc-script-vieira'
const SCRIPT_SRC = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'

function removeBmcArtifacts () {
  document.getElementById(SCRIPT_ID)?.remove()
  document.querySelectorAll('a[href*="buymeacoffee.com/vieira"]').forEach((el) => {
    el.remove()
  })
  document.querySelectorAll('[id^="bmc-wbtn"]').forEach((el) => {
    el.remove()
  })
}

/**
 * Floating BMC widget (bottom-right). Hidden in recruiter mode.
 * Not rendered inside Footer social links.
 */
export default function BuyMeCoffee () {
  const { isRecruiterMode } = useRecruiterMode()

  useEffect(() => {
    if (isRecruiterMode) {
      removeBmcArtifacts()
      return
    }

    if (document.getElementById(SCRIPT_ID)) return

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'text/javascript'
    script.src = SCRIPT_SRC
    script.setAttribute('data-name', 'bmc-button')
    script.setAttribute('data-slug', 'vieira')
    script.setAttribute('data-color', '#FFDD00')
    script.setAttribute('data-emoji', '')
    script.setAttribute('data-font', 'Cookie')
    script.setAttribute('data-text', 'Buy me a coffee')
    script.setAttribute('data-outline-color', '#000000')
    script.setAttribute('data-font-color', '#000000')
    script.setAttribute('data-coffee-color', '#ffffff')
    document.body.appendChild(script)

    return () => {
      removeBmcArtifacts()
    }
  }, [isRecruiterMode])

  return null
}
