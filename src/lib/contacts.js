// Sample directory. Phone numbers are placeholders.
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
  { id: 'c1', name: 'Admin office', who: 'Mr. Patil', bld: 'Admin', where: 'Ground floor, Room 1', phone: '022-0000-0101', days: WEEK, from: 10, to: 16, helps: ['id card', 'bonafide', 'certificate', 'fees', 'admission'] },
  { id: 'c2', name: 'Accounts section', who: 'Mrs. Nair', bld: 'Admin', where: 'Ground floor, Room 3', phone: '022-0000-0102', days: [1, 2, 3, 4, 5], from: 10, to: 15, helps: ['fees', 'receipt', 'refund', 'scholarship'] },
  { id: 'c3', name: 'Exam cell', who: 'Prof. Kulkarni', bld: 'Main', where: '1st floor, Room 105', phone: '022-0000-0103', days: [1, 2, 3, 4, 5], from: 11, to: 16, helps: ['exam form', 'hall ticket', 'results', 'revaluation'] },
  { id: 'c4', name: 'Library desk', who: 'Ms. Shah', bld: 'Library', where: 'Ground floor', phone: '022-0000-0104', days: WEEK, from: 8, to: 20, helps: ['books', 'library card', 'fine', 'reading room'] },
  { id: 'c5', name: 'IT help desk', who: 'Mr. Dsouza', bld: 'Main', where: '2nd floor, Room 210', phone: '022-0000-0105', days: WEEK, from: 9, to: 17, helps: ['wi-fi', 'lms login', 'email', 'lab computer'] },
  { id: 'c6', name: 'Student council', who: 'Aditi (President)', bld: 'Main', where: 'Ground floor, Room 12', phone: '022-0000-0106', days: WEEK, from: 12, to: 17, helps: ['events', 'clubs', 'complaints', 'lost item'] },
  { id: 'c7', name: 'Sports department', who: 'Mr. Rane', bld: 'Sports', where: 'Sports ground office', phone: '022-0000-0107', days: WEEK, from: 7, to: 18, helps: ['football', 'trials', 'gym', 'sports kit'] },
  { id: 'c8', name: 'Canteen manager', who: 'Mr. Shetty', bld: 'Canteen', where: 'Canteen counter', phone: '022-0000-0108', days: WEEK, from: 8, to: 18, helps: ['food', 'lost item', 'coupons'] },
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
