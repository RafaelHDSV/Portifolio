import { useEffect, useState } from 'react'

function isVieiraModeActive (): boolean {
  const mode = new URLSearchParams(window.location.search).get('mode')
  return mode === 'vieira' || mode === 'space'
}

export function useVieiraModeFromUrl (): boolean {
  const [active, setActive] = useState(isVieiraModeActive)

  useEffect(() => {
    const sync = () => {
      const isVieira = isVieiraModeActive()
      setActive(isVieira)
      document.documentElement.classList.toggle('vieira-mode', isVieira)
    }

    sync()
    window.addEventListener('popstate', sync)

    return () => {
      window.removeEventListener('popstate', sync)
      document.documentElement.classList.remove('vieira-mode')
    }
  }, [])

  return active
}

/** @deprecated use useVieiraModeFromUrl */
export function useSpaceModeFromUrl (): boolean {
  return useVieiraModeFromUrl()
}
