import React, { createContext, useContext, useEffect, useState } from 'react'

// The build and the first browser render use the same location. URL filters
// are applied after hydration; this also works when JavaScript loads slowly.
const PageLocation = createContext({ pathname: '/', search: '' })
export const PageLocationProvider = PageLocation.Provider
export const useInitialLocation = () => useContext(PageLocation)
export function usePageLocation() {
  const initial = useInitialLocation()
  const [location, setLocation] = useState(initial)
  useEffect(() => {
    const sync = () => setLocation({ pathname: window.location.pathname, search: window.location.search })
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  return location
}
