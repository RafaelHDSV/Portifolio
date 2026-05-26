import { useEffect, useState } from 'react'

const SECTION_IDS = ['about', 'languages', 'projects', 'contact'] as const

const VIEWPORT_ANCHOR_RATIO = 0.35

function resolveActiveSection (): string {
  const anchorY = window.innerHeight * VIEWPORT_ANCHOR_RATIO
  let current: string = SECTION_IDS[0]

  for (const id of SECTION_IDS) {
    const element = document.getElementById(id)
    if (!element) continue

    const { top, bottom } = element.getBoundingClientRect()
    if (top <= anchorY && bottom > anchorY) {
      return id
    }

    if (top <= anchorY) {
      current = id
    }
  }

  return current
}

export function useActiveSection () {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const update = () => {
      setActiveSection(resolveActiveSection())
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return activeSection
}
