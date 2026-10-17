// CGPA trend maths. Pure functions, easy to test.
// CGPA = sum(SGPA x credits) / sum(credits), counted semester by semester.

export const MAX_SEMS = 8

// One point per finished semester: that semester's SGPA and the CGPA so far.
export function trend(sems) {
  let points = 0
  let credits = 0
  return sems.map((s, i) => {
    points += s.sgpa * s.credits
    credits += s.credits
    return { sem: i + 1, sgpa: s.sgpa, cgpa: credits ? points / credits : 0 }
  })
}

// CGPA if the next semester ends at `sgpa` with `credits` credits.
export function cgpaWith(sems, sgpa, credits) {
  const points = sems.reduce((a, s) => a + s.sgpa * s.credits, 0) + sgpa * credits
  const total = sems.reduce((a, s) => a + s.credits, 0) + credits
  return total ? points / total : 0
}
