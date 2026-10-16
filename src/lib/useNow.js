import { useEffect, useState } from 'react'

// Current time that refreshes by itself, so event badges update live.
export function useNow(ms = 15000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}
