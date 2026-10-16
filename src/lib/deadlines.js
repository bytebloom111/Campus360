const pad = (n) => String(n).padStart(2, '0')
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// Whole days from today to a 'YYYY-MM-DD' date. Negative = past.
export function daysAway(key) {
  const [y, m, d] = key.split('-').map(Number)
  return Math.round((new Date(y, m - 1, d) - startOfToday()) / 864e5)
}

export const away = (o) => (o === 0 ? 'Today' : o === 1 ? 'Tomorrow' : `In ${o} days`)

// Colour code: red within 2 days, yellow within a week, lilac later, grey past.
export const tone = (o) => (o < 0 ? 'gray' : o <= 2 ? 'rose' : o <= 7 ? 'sun' : 'lilac')

export function seedDeadlines() {
  const add = (n) => {
    const d = startOfToday()
    d.setDate(d.getDate() + n)
    return toKey(d)
  }
  return [
    { id: 'd1', title: 'Chemistry assignment', date: add(1), note: 'Submit on the LMS by 11:59 pm' },
    { id: 'd2', title: 'Maths unit test', date: add(2), note: 'Chapters 1 to 3' },
    { id: 'd3', title: 'Physics lab record', date: add(6), note: 'Submit to the lab in-charge' },
    { id: 'd4', title: 'Mid-sem form', date: add(12), note: 'Fill it on the portal' },
  ]
}
