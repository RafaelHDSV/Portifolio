import { useEffect, useState } from 'react'
import AnimatedCursor from 'react-animated-cursor'
import { getRGBFromCSSVariable } from '../../hooks/useCssVariableRGB'

export default function CustomCursor() {
  const [rgbColor, setRgbColor] = useState<string>()
  const clickables = [
    'a',
    'button',
    'input[type="submit"]',
    'input[type="button"]',
    '.cursor-hover'
  ]

  useEffect(() => {
    const rgb = getRGBFromCSSVariable('--primary-color')
    setRgbColor(rgb)
  }, [])

  if (!rgbColor) return null

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
    />
  )
}
