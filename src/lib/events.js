// Campus events and the live-state rule. Pure functions, easy to test.
const MIN = 60000
// Demo timing: events are placed relative to the moment the app opens, so
// every state is visible on demo day. Real events would have fixed dates.
const BASE = Date.now()
const def = (id, title, venue, tags, offsetMin, durationMin, g) => ({
  id, title, venue, tags, start: BASE + offsetMin * MIN, durationMin, g,
})

export const EVENTS = [
  def('e1', 'Coding workshop', 'Hall B', ['Coding'], -60, 180, '#ecdcff,#fbd0e8'),
  def('e2', 'Robotics talk', 'Seminar room', ['Robotics'], 120, 120, '#c4f3fb,#8fd0f4'),
  def('e3', 'Open mic night', 'Auditorium', ['Music'], 182, 90, '#fbd0e8,#ffe8a8'),
  def('e4', 'Tech fest quiz night', 'Auditorium', ['Coding', 'Design'], 1800, 120, '#fbd0e8,#bdeefa'),
  def('e5', 'Football trials', 'Sports ground', ['Football'], 1560, 120, '#c8f0e3,#bdeefa'),
  def('e6', 'Photo walk', 'Campus gardens', ['Photography'], 3000, 90, '#fff0c9,#fbd0e8'),
  def('e7', 'Freshers meet', 'Ground', [], -1800, 180, '#e6d9fb,#a9e4f6'),
]

export const STATE = {
  open: { label: 'Registration open', dot: 'bg-[#b79cf0]' },
  soon: { label: 'Starting soon', dot: 'bg-[#f5c542]' },
  live: { label: 'Live now', dot: 'bg-[#3cc79a]' },
  ended: { label: 'Event ended', dot: 'bg-[#aab1c0]' },
}

// Registration open -> Starting soon (3 hours before) -> Live now -> Event ended
export function eventState(e, now) {
  const end = e.start + e.durationMin * MIN
  if (now >= end) return 'ended'
  if (now >= e.start) return 'live'
  if (e.start - now <= 3 * 60 * MIN) return 'soon'
  return 'open'
}

export const matches = (e, interests) => e.tags.filter((t) => interests.includes(t)).length

// Events that match the student's interests come first. Ended events go last.
export function rankEvents(events, interests, now) {
  return [...events].sort((a, b) => {
    const ea = eventState(a, now) === 'ended'
    const eb = eventState(b, now) === 'ended'
    if (ea !== eb) return ea ? 1 : -1
    const m = matches(b, interests) - matches(a, interests)
    return m || a.start - b.start
  })
}
