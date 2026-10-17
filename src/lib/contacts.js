// Sample directory. Names are placeholders.
export const BUILDINGS = [
  { id: 'Admin', x: 10, y: 10, w: 100, h: 60 },
  { id: 'Main', x: 130, y: 10, w: 120, h: 60 },
  { id: 'Library', x: 10, y: 90, w: 100, h: 55 },
  { id: 'Canteen', x: 130, y: 90, w: 55, h: 55 },
  { id: 'Sports', x: 195, y: 90, w: 55, h: 55 },
]
// days: 0 = Sunday. hours are 24h.
const WEEK = [1, 2, 3, 4, 5, 6]
export const PLACES = [
  { id: 'c1', name: 'Admin office', who: 'Mr. Patil', bld: 'Admin', where: 'Ground floor, Room 1', days: WEEK, from: 10, to: 16, helps: ['id card', 'bonafide', 'certificate', 'fees', 'admission'] },
  { id: 'c2', name: 'Accounts section', who: 'Mrs. Nair', bld: 'Admin', where: 'Ground floor, Room 3', days: [1, 2, 3, 4, 5], from: 10, to: 15, helps: ['fees', 'receipt', 'refund', 'scholarship'] },
  { id: 'c3', name: 'Exam cell', who: 'Prof. Kulkarni', bld: 'Main', where: '1st floor, Room 105', days: [1, 2, 3, 4, 5], from: 11, to: 16, helps: ['exam form', 'hall ticket', 'results', 'revaluation'] },
  { id: 'c4', name: 'Library desk', who: 'Ms. Shah', bld: 'Library', where: 'Ground floor', days: WEEK, from: 8, to: 20, helps: ['books', 'library card', 'fine', 'reading room'] },
  { id: 'c5', name: 'IT help desk', who: 'Mr. Dsouza', bld: 'Main', where: '2nd floor, Room 210', days: WEEK, from: 9, to: 17, helps: ['wi-fi', 'lms login', 'email', 'lab computer'] },
  { id: 'c6', name: 'Student council', who: 'Aditi (President)', bld: 'Main', where: 'Ground floor, Room 12', days: WEEK, from: 12, to: 17, helps: ['events', 'clubs', 'complaints', 'lost item'] },
  { id: 'c7', name: 'Sports department', who: 'Mr. Rane', bld: 'Sports', where: 'Sports ground office', days: WEEK, from: 7, to: 18, helps: ['football', 'trials', 'gym', 'sports kit'] },
  { id: 'c8', name: 'Canteen manager', who: 'Mr. Shetty', bld: 'Canteen', where: 'Canteen counter', days: WEEK, from: 8, to: 18, helps: ['food', 'lost item', 'coupons'] },
]
export const QUICK = ['ID card', 'Fees', 'Exam form', 'Scholarship', 'Lost item', 'Wi-Fi']

export function isOpen(p, now) {
  const d = new Date(now)
  const h = d.getHours() + d.getMinutes() / 60
  return p.days.includes(d.getDay()) && h >= p.from && h < p.to
}
export const hoursText = (p) => {
  const t = (h) => (h > 12 ? `${h - 12} pm` : h === 12 ? '12 pm' : `${h} am`)
  return `${p.days.length === 6 ? 'Mon to Sat' : 'Mon to Fri'}, ${t(p.from)} to ${t(p.to)}`
}
export const findPlaces = (q, bld) => {
  const s = q.trim().toLowerCase()
  return PLACES.filter(
    (p) => (!bld || p.bld === bld) && (!s || [p.name, p.who, ...p.helps].join(' ').toLowerCase().includes(s)),
  )
}

// Faculty availability. Staff post a status; students only see it (no phone numbers).
const MIN = 60000
const BASE = Date.now()
export const STATUS = {
  free: { label: 'Free', tone: 'mint' },
  busy: { label: 'Busy', tone: 'rose' },
  lecture: { label: 'In lecture', tone: 'sun' },
  away: { label: 'Away', tone: 'gray' },
}
export const FACULTY = [
  { id: 'f1', name: 'Prof. Kulkarni', subject: 'Maths', cabin: 'Main, Room 105', status: 'free', note: 'Open for doubts until 4 pm', at: BASE - 4 * MIN },
  { id: 'f2', name: 'Prof. Iyer', subject: 'Physics', cabin: 'Main, Room 112', status: 'lecture', note: 'Lecture with Comp-B, till 12:30 pm', at: BASE - 12 * MIN },
  { id: 'f3', name: 'Dr. Mehta', subject: 'Chemistry', cabin: 'Main, Room 118', status: 'busy', note: 'Checking answer papers', at: BASE - 25 * MIN },
  { id: 'f4', name: 'Prof. Joshi', subject: 'Programming', cabin: 'Main, Room 210', status: 'free', note: 'In the cabin', at: BASE - 40 * MIN },
  { id: 'f5', name: 'Prof. Menon', subject: 'Electronics', cabin: 'Main, Room 215', status: 'away', note: 'On leave today', at: BASE - 90 * MIN },
  { id: 'f6', name: 'Prof. Sharma', subject: 'Communication skills', cabin: 'Main, Room 301', status: 'busy', note: 'In a meeting until 2 pm', at: BASE - 8 * MIN },
]
export function ago(at, now) {
  const m = Math.max(0, Math.round((now - at) / MIN))
  return m < 1 ? 'Updated just now' : m < 60 ? `Updated ${m} min ago` : `Updated ${Math.round(m / 60)} h ago`
}
export const findFaculty = (q, status) => {
  const s = q.trim().toLowerCase()
  return FACULTY.filter(
    (f) => (!status || f.status === status) && (!s || [f.name, f.subject].join(' ').toLowerCase().includes(s)),
  )
}
