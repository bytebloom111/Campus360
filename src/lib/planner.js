// Planner maths. Pure functions: no screens, no storage. Easy to test.
// Cutoffs are a percentage of the subject's total marks (internal + final).

export const DEFAULT_SCALE = [
  { grade: 'O', points: 10, minPct: 90 },
  { grade: 'A', points: 9, minPct: 80 },
  { grade: 'B', points: 8, minPct: 70 },
  { grade: 'C', points: 7, minPct: 60 },
  { grade: 'D', points: 6, minPct: 50 },
  { grade: 'P', points: 5, minPct: 40 },
]
export const FAIL = { grade: 'F', points: 0 }

const mk = (id, name, credits, internal) => ({
  id, name, credits, internal,
  internalMax: 40, finalMax: 60, passTotal: 40, passFinalMin: 0,
})
export const DEFAULT_SUBJECTS = [
  mk('s1', 'Maths', 4, 30),
  mk('s2', 'Physics', 3, 28),
  mk('s3', 'Chemistry', 3, 15),
  mk('s4', 'Programming', 4, 34),
]

const EPS = 1e-9
const byCutoff = (scale) => [...scale].sort((a, b) => b.minPct - a.minPct)
export const totalMax = (s) => s.internalMax + s.finalMax

// Total marks needed for a grade. Never lower than the pass mark.
export const cutoffMarks = (s, g) =>
  Math.max(Math.ceil((g.minPct * totalMax(s)) / 100 - EPS), s.passTotal)

// Marks still needed in the final exam for a grade:
// required total minus internal marks, and at least the final-exam minimum.
export const needInFinal = (s, g) =>
  Math.max(cutoffMarks(s, g) - s.internal, s.passFinalMin, 0)

// 'locked' = even full marks in the final cannot reach it.
// 'secured' = already reached, nothing more needed.
export function gradeStatus(s, g) {
  const need = needInFinal(s, g)
  if (need > s.finalMax) return { state: 'locked', need }
  if (need === 0) return { state: 'secured', need }
  return { state: 'open', need }
}

// Passing minimum: the total pass mark AND the final-exam minimum.
export function passInfo(s) {
  const need = Math.max(s.passTotal - s.internal, s.passFinalMin, 0)
  return { need, canPass: need <= s.finalMax, secured: need === 0 }
}

export function gradeFor(s, scale, final) {
  const total = s.internal + final
  if (total < s.passTotal || final < s.passFinalMin) return FAIL
  const sorted = byCutoff(scale)
  return sorted.find((g) => total >= cutoffMarks(s, g)) || sorted[sorted.length - 1]
}

// SGPA = sum(credits x grade points) / total credits.
// `finals` holds one final-exam score per subject, in the same order.
export function sgpa(subjects, scale, finals) {
  let points = 0
  let credits = 0
  const failed = []
  subjects.forEach((s, i) => {
    const g = gradeFor(s, scale, finals[i])
    points += s.credits * g.points
    credits += s.credits
    if (g === FAIL) failed.push(s.name)
  })
  return { sgpa: credits ? points / credits : 0, failed }
}

// Best case = full marks in every final exam.
export const bestCase = (subjects, scale) =>
  sgpa(subjects, scale, subjects.map((s) => s.finalMax))

// Target check. A failed subject makes the semester not achievable,
// however high the SGPA looks.
export function checkTarget(subjects, scale, target) {
  if (!subjects.length) return { ok: false, best: 0, reason: 'Add at least one subject.' }
  const best = bestCase(subjects, scale)
  if (best.failed.length) {
    return {
      ok: false,
      best: best.sgpa,
      reason: `${best.failed.join(', ')} cannot reach the pass mark, even with full marks in the final.`,
    }
  }
  if (best.sgpa + EPS < target) {
    return {
      ok: false,
      best: best.sgpa,
      reason: `With full marks in every final, the best SGPA is ${best.sgpa.toFixed(2)}.`,
    }
  }
  return { ok: true, best: best.sgpa, reason: '' }
}

// Starting data for a new student's planner (also used by the Home screen).
export const DEFAULT_PLANNER = {
  subjects: DEFAULT_SUBJECTS,
  scale: DEFAULT_SCALE,
  target: 8.5,
  whatIf: {},
}
