export const MODES = {
  focus: { label: 'Focus', min: 25 },
  short: { label: 'Short break', min: 5 },
  long: { label: 'Long break', min: 15 },
}
export const fmt = (ms) => {
  const s = Math.ceil(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
const dayKey = (t) => new Date(t).toDateString()
export const todayStats = (log) => {
  const k = dayKey(Date.now())
  const t = log.filter((l) => dayKey(l.ts) === k)
  return { min: t.reduce((s, l) => s + l.min, 0), n: t.length }
}
export const weekMinutes = (log) => {
  const from = Date.now() - 7 * 864e5
  return log.filter((l) => l.ts >= from).reduce((s, l) => s + l.min, 0)
}
