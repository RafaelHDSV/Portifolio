import { useEffect } from 'react'
import { useRecruiterMode } from '../../context/useRecruiterMode'

const SCRIPT_ID = 'bmc-widget-vieira'
const SCRIPT_SRC = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js'
/** Fallback when site has no primary/accent — BMC yellow */
const BMC_YELLOW = '#FFDD00'

function cssColorToHex (value: string): string | null {
  const v = value.trim()
  if (!v) return null
  if (v.startsWith('#')) {
    if (v.length === 4) {
      const r = v[1]
      const g = v[2]
      const b = v[3]
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
    }
    return v.length >= 7 ? v.slice(0, 7).toUpperCase() : null
  }

  const temp = document.createElement('div')
  temp.style.color = v
  document.body.appendChild(temp)
  const rgb = getComputedStyle(temp).color
  document.body.removeChild(temp)
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (!m) return null
  const hex = (n: string) => Number(n).toString(16).padStart(2, '0')
  return `#${hex(m[1])}${hex(m[2])}${hex(m[3])}`.toUpperCase()
}

function resolveWidgetColor (): string {
  const root = getComputedStyle(document.documentElement)
  return (
    cssColorToHex(root.getPropertyValue('--color-accent')) ??
    cssColorToHex(root.getPropertyValue('--primary-color')) ??
    BMC_YELLOW
  )
}

function removeWidget () {
  document.getElementById(SCRIPT_ID)?.remove()
  document.querySelectorAll('#bmc-wbtn, .bmc-btn, iframe[src*="buymeacoffee"]').forEach((el) => {
    el.remove()
  })
}

function mountWidget (color: string) {
  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.src = SCRIPT_SRC
  script.setAttribute('data-name', 'BMC-Widget')
  script.setAttribute('data-cfasync', 'false')
  script.setAttribute('data-id', 'vieira')
  script.setAttribute('data-description', 'Support me on Buy me a coffee!')
  script.setAttribute('data-message', '')
  script.setAttribute('data-color', color)
  script.setAttribute('data-position', 'Right')
  script.setAttribute('data-x_margin', '18')
  script.setAttribute('data-y_margin', '18')
  document.body.appendChild(script)
}

/**
 * Official BMC website widget (Right, margins 18). Hidden in recruiter mode.
 */
export default function BuyMeCoffee () {
  const { isRecruiterMode } = useRecruiterMode()

  useEffect(() => {
    if (isRecruiterMode) {
      removeWidget()
      return
    }

    removeWidget()
    mountWidget(resolveWidgetColor())

    const onAccent = () => {
      removeWidget()
      mountWidget(resolveWidgetColor())
    }
    window.addEventListener('accent-theme-change', onAccent)

    return () => {
      window.removeEventListener('accent-theme-change', onAccent)
      removeWidget()
    }
  }, [isRecruiterMode])

  return null
}
