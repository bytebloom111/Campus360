import { useEffect } from 'react'
import { useLocalStorage } from './storage'

// Rides. Demo rides are placed relative to the moment the app opens.
const MIN = 60000
const BASE = Date.now()
export const SEATS = 4
const SEED = [
  { id: 'r1', to: 'Kurla station', v: 'Sharing auto', by: 'Riya', n: 2, fixed: true, exp: BASE + 20 * MIN },
  { id: 'r2', to: 'Thane', v: 'Cab', by: 'Karan', n: 3, total: 480, exp: BASE + 12 * MIN },
  { id: 'r3', to: 'Dadar', v: 'Meter auto', by: 'Sneha', n: 1, total: 240, exp: BASE + 18 * MIN },
]

export const VEHICLES = ['Sharing auto', 'Meter auto', 'Cab']
export const fareEach = (r) => (r.fixed ? 30 : Math.round(r.total / r.n))
export const minsLeft = (r, now) => Math.max(0, Math.ceil((r.exp - now) / MIN))
export function rideStatus(r, now) {
  if (r.cx) return 'Cancelled'
  if (r.n >= SEATS) return 'Full'
  if (now > r.exp) return 'Expired'
  return 'Open'
}

// mine: rides the student posted. req: seat requests by ride id. cx: cancelled ids.
export function useRides(phone) {
  const [st, setSt] = useLocalStorage(`c360.rides.${phone}`, { mine: [], req: {}, cx: [] })

  // A requested seat is confirmed after a short delay (simulated driver reply).
  const pending = Object.keys(st.req).filter((id) => st.req[id] === 'Requested').join(',')
  useEffect(() => {
    if (!pending) return
    const t = setTimeout(() => {
      setSt((s) => {
        const req = { ...s.req }
        Object.keys(req).forEach((id) => {
          if (req[id] === 'Requested') req[id] = 'Confirmed'
        })
        return { ...s, req }
      })
    }, 2200)
    return () => clearTimeout(t)
  }, [pending, setSt])

  const rides = [...st.mine, ...SEED].map((r) => ({
    ...r,
    n: Math.min(SEATS, r.n + (st.req[r.id] === 'Confirmed' ? 1 : 0)),
    cx: st.cx.includes(r.id),
    mine: !!r.mine,
    req: st.req[r.id],
  }))

  return {
    rides,
    post: (to, v, total) =>
      setSt((s) => ({
        ...s,
        mine: [
          { id: 'm' + Date.now(), to: to.trim() || 'Kurla station', v, by: 'You', n: 1,
            fixed: v === 'Sharing auto', total: total || 120, exp: Date.now() + 15 * MIN, mine: true },
          ...s.mine,
        ],
      })),
    request: (id) => setSt((s) => ({ ...s, req: { ...s.req, [id]: 'Requested' } })),
    join: (id) =>
      setSt((s) => ({ ...s, mine: s.mine.map((r) => (r.id === id && r.n < SEATS ? { ...r, n: r.n + 1 } : r)) })),
    cancel: (id) => setSt((s) => ({ ...s, cx: [...s.cx, id] })),
  }
}
