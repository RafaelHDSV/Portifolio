import { useEffect, useState } from 'react'

function isSpaceModeActive (): boolean {
  return new URLSearchParams(window.location.search).get('mode') === 'space'
}

export function useSpaceModeFromUrl (): boolean {
  const [active, setActive] = useState(isSpaceModeActive)

  useEffect(() => {
    const sync = () => {
      const isSpace = isSpaceModeActive()
      setActive(isSpace)
      document.documentElement.classList.toggle('space-mode', isSpace)
    }

    sync()
    window.addEventListener('popstate', sync)

    return () => {
      window.removeEventListener('popstate', sync)
      document.documentElement.classList.remove('space-mode')
    }
  }, [])

  return active
}
