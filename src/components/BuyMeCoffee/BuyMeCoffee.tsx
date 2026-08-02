import { useEffect } from 'react'
import { useRecruiterMode } from '../../context/useRecruiterMode'
import './bmcWidget.scss'

/**
 * Widget script lives in index.html (same pattern as static sites).
 * This only hides/shows #bmc-wbtn in recruiter mode — dynamic script
 * injection breaks BMC (Strict Mode remount / script cache).
 */
function setWidgetVisible (visible: boolean) {
  const nodes = document.querySelectorAll<HTMLElement>(
    '#bmc-wbtn, .bmc-btn, iframe[src*="buymeacoffee.com"]'
  )
  nodes.forEach((el) => {
    el.style.setProperty('display', visible ? '' : 'none', 'important')
  })
}

export default function BuyMeCoffee () {
  const { isRecruiterMode } = useRecruiterMode()

  useEffect(() => {
    setWidgetVisible(!isRecruiterMode)

    const observer = new MutationObserver(() => {
      setWidgetVisible(!isRecruiterMode)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [isRecruiterMode])

  return null
}
