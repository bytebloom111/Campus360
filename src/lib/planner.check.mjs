// Run with:  node src/lib/planner.check.mjs
import {
  DEFAULT_SCALE, gradeStatus, needInFinal, passInfo, gradeFor, sgpa, checkTarget,
} from './planner.js'

let failures = 0
const check = (name, ok) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) failures++
}
const sub = (o) => ({
  id: 'x', name: 'S', credits: 4, internal: 25,
  internalMax: 40, finalMax: 60, passTotal: 40, passFinalMin: 0, ...o,
})
const A = DEFAULT_SCALE.find((g) => g.grade === 'A')

// Example from the problem statement: pass 40/100, A at 80, internal 25/40.
check('A needs 55 in the final', needInFinal(sub({}), A) === 55)
check('A is open (55 is reachable out of 60)', gradeStatus(sub({}), A).state === 'open')
check('a grade needing 70 out of 60 is locked',
  gradeStatus(sub({}), { grade: 'A', points: 9, minPct: 95 }).state === 'locked')
check('grade already reached is secured', gradeStatus(sub({ internal: 40 }), { grade: 'P', points: 5, minPct: 30 }).state === 'secured')
check('pass needs 15 more in the final', passInfo(sub({})).need === 15)
check('cannot pass if even full final falls short',
  passInfo(sub({ internal: 0, finalMax: 30 })).canPass === false)
check('final-exam minimum is enforced',
  needInFinal(sub({ internal: 40, passFinalMin: 20 }), DEFAULT_SCALE[5]) === 20)
check('below the final-exam minimum is a fail',
  gradeFor(sub({ internal: 40, passFinalMin: 20 }), DEFAULT_SCALE, 10).grade === 'F')
check('80 total gives grade A', gradeFor(sub({}), DEFAULT_SCALE, 55).grade === 'A')
check('79 total gives grade B', gradeFor(sub({}), DEFAULT_SCALE, 54).grade === 'B')

// SGPA = (4x9 + 2x6) / 6 = 8
const two = [sub({ id: 'a', credits: 4 }), sub({ id: 'b', credits: 2 })]
check('SGPA is the credit-weighted average',
  Math.abs(sgpa(two, DEFAULT_SCALE, [55, 25]).sgpa - 8) < 1e-9)

// Target check
check('target 8.5 achievable when best case is high',
  checkTarget([sub({ internal: 38 }), sub({ id: 'b', internal: 38 })], DEFAULT_SCALE, 8.5).ok)
check('target not achievable when a subject cannot be passed',
  !checkTarget([sub({ internal: 38 }), sub({ id: 'b', internal: 0, finalMax: 30 })], DEFAULT_SCALE, 5).ok)
check('target above the best possible is not achievable',
  !checkTarget([sub({ internal: 10 })], DEFAULT_SCALE, 10).ok)

console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll checks passed')
process.exit(failures ? 1 : 0)
