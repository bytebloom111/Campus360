import { DIVISIONS } from './campus'
import { useLocalStorage } from './storage'

// Starting points of every division (sample numbers for the demo).
const BASE_POINTS = { 'Comp-A': 120, 'Comp-B': 150, 'Comp-C': 90, 'IT-A': 140, 'IT-B': 110, 'AIDS-A': 130, 'EXTC-A': 100 }

export const TASKS = [
  { id: 't1', title: 'Collect 20 books for the library drive', pts: 50 },
  { id: 't2', title: 'Attend the Friday coding workshop', pts: 30 },
  { id: 't3', title: 'Post a photo of the campus clean-up', pts: 40 },
]

const sortBoard = (a) => a.sort((x, y) => y.pts - x.pts || x.name.localeCompare(y.name))

export function boards(division, earned) {
  const divs = DIVISIONS.map((x) => ({
    name: x.d, branch: x.b, pts: (BASE_POINTS[x.d] || 0) + (x.d === division ? earned : 0),
  }))
  const byBranch = {}
  divs.forEach((d) => (byBranch[d.branch] = (byBranch[d.branch] || 0) + d.pts))
  const branches = Object.keys(byBranch).map((b) => ({ name: b, branch: b, pts: byBranch[b] }))
  return { divisions: sortBoard(divs), branches: sortBoard(branches) }
}

export function useChallenges(phone, profile) {
  const [done, setDone] = useLocalStorage(`c360.challenges.${phone}`, [])
  const earned = TASKS.filter((t) => done.includes(t.id)).reduce((s, t) => s + t.pts, 0)
  const b = boards(profile?.division, earned)
  const rank = b.divisions.findIndex((d) => d.name === profile?.division) + 1
  const complete = (id) => setDone((d) => (d.includes(id) ? d : [...d, id]))
  return { done, complete, earned, ...b, rank }
}
