import { useEffect, useState } from 'react'
import { useEasterEgg } from './useEasterEgg'

export function useActiveSection () {
  const { registerSectionVisit } = useEasterEgg()
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const SECTION_IDS = ['about', 'languages', 'projects', 'linkedin', 'contact']

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
            registerSectionVisit(id)
          }
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [registerSectionVisit])

  return activeSection
}
