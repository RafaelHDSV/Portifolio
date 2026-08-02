import { useEffect, useState } from 'react'
import AnimatedCursor from 'react-animated-cursor'
import { getRGBFromCSSVariable } from '../../hooks/useCssVariableRGB'

export default function CustomCursor () {
  const [rgbColor, setRgbColor] = useState<string>()
  const [enabled, setEnabled] = useState(false)

  const clickables = [
    'a',
    'button',
    'input[type="submit"]',
    'input[type="button"]',
    '.cursor-hover',
    '#bmc-wbtn',
    '.bmc-btn'
  ]

  const refreshAccent = () => {
    const rgb = getRGBFromCSSVariable('--color-accent')
    if (rgb) setRgbColor(rgb)
  }

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    setEnabled(finePointer && !reducedMotion)
    refreshAccent()

    window.addEventListener('accent-theme-change', refreshAccent)

    const observer = new MutationObserver(refreshAccent)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      window.removeEventListener('accent-theme-change', refreshAccent)
      observer.disconnect()
    }
  }, [])

  if (!enabled || !rgbColor) return null

  // Above BMC widget (and other fixed overlays) so the cursor never sits under the badge
  const cursorLayer = 2147483646

  return (
    <AnimatedCursor
      key={rgbColor}
      innerSize={8}
      outerSize={32}
      color={rgbColor}
      outerAlpha={0.3}
      innerScale={1}
      outerScale={2}
      trailingSpeed={8}
      clickables={clickables}
      innerStyle={{ zIndex: cursorLayer }}
      outerStyle={{ zIndex: cursorLayer - 1 }}
    />
  )
}
