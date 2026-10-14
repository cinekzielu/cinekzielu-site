import React, { useEffect, useState } from 'react'

export function ClientContent({ children, fallback = null }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  return ready ? <React.Suspense fallback={fallback}>{children}</React.Suspense> : fallback
}
