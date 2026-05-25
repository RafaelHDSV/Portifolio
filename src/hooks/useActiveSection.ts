import { useEffect, useState } from 'react'
import { SECTION_TOUR_IDS } from './useEasterEgg.types'
import { useEasterEgg } from './useEasterEgg'

const SECTION_IDS = ['about', 'languages', 'projects', 'contact'] as const

function isSectionInView (element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
  const ratio = visibleHeight / Math.max(rect.height, 1)
  return ratio >= 0.2 && rect.top < viewportHeight * 0.85
}

export function useActiveSection () {
  const { registerSectionVisit } = useEasterEgg()
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    const handleIntersect = (id: string, entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
        setActiveSection(id)
        registerSectionVisit(id)
      }
    }

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) return

      if (isSectionInView(element)) {
        setActiveSection(id)
        registerSectionVisit(id)
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) handleIntersect(id, entry)
        },
        { rootMargin: '-12% 0px -12% 0px', threshold: [0.2, 0.35, 0.5] }
      )

      observer.observe(element)
      observers.push(observer)
    })

    const onScroll = () => {
      for (const id of SECTION_TOUR_IDS) {
        const element = document.getElementById(id)
        if (element && isSectionInView(element)) {
          setActiveSection(id)
          registerSectionVisit(id)
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('scroll', onScroll)
    }
  }, [registerSectionVisit])

  return activeSection
}
