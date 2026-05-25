import { useEffect, useState } from 'react'

const SECTION_IDS = ['about', 'languages', 'projects', 'contact'] as const

export function useActiveSection () {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    const handleIntersect = (id: string, entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
        setActiveSection(id)
      }
    }

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) handleIntersect(id, entry)
        },
        { rootMargin: '-12% 0px -12% 0px', threshold: [0.2, 0.35, 0.5] }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((o) => o.disconnect())
    }
  }, [])

  return activeSection
}
