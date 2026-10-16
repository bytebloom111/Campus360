// Run with:  node src/lib/events.check.mjs
import { eventState, rankEvents } from './events.js'
import { tone, daysAway, toKey, startOfToday } from './deadlines.js'

let failures = 0
const check = (name, ok) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) failures++
}
const H = 3600000
const now = Date.now()
const ev = (startH, durH, tags = []) => ({ start: now + startH * H, durationMin: durH * 60, tags })

check('4 hours before: Registration open', eventState(ev(4, 2), now) === 'open')
check('3 hours before: Starting soon', eventState(ev(3, 2), now) === 'soon')
check('1 hour before: Starting soon', eventState(ev(1, 2), now) === 'soon')
check('started 10 minutes ago: Live now', eventState(ev(-1 / 6, 1), now) === 'live')
check('finished: Event ended', eventState(ev(-2, 1), now) === 'ended')

const a = ev(10, 1, ['Music'])
const b = ev(5, 1, ['Coding'])
const c = ev(-5, 1, ['Coding'])
const ranked = rankEvents([b, c, a], ['Music'], now)
check('interest match comes first', ranked[0] === a)
check('ended event goes last', ranked[2] === c)

check('colour: past is grey', tone(-1) === 'gray')
check('colour: today is red', tone(0) === 'rose')
check('colour: 2 days is red', tone(2) === 'rose')
check('colour: 3 to 7 days is yellow', tone(3) === 'sun' && tone(7) === 'sun')
check('colour: later is lilac', tone(8) === 'lilac')
check('daysAway today is 0', daysAway(toKey(startOfToday())) === 0)
const t = startOfToday(); t.setDate(t.getDate() + 1)
check('daysAway tomorrow is 1', daysAway(toKey(t)) === 1)

console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll checks passed')
process.exit(failures ? 1 : 0)
