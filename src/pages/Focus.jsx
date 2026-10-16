import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/app-context'
import { useLocalStorage } from '../lib/storage'
import { DEFAULT_PLANNER } from '../lib/planner'
import { MODES, fmt, todayStats, weekMinutes } from '../lib/focus'
import { Card, Button, PageHeader } from '../components/ui'

export default function Focus() {
  const { session } = useApp()
  const [plan] = useLocalStorage(`c360.planner.${session.phone}`, DEFAULT_PLANNER)
  const [log, setLog] = useLocalStorage(`c360.focus.${session.phone}`, [])
  const [mode, setMode] = useState('focus')
  const [subject, setSubject] = useState('')
  const [left, setLeft] = useState(MODES.focus.min * 60000)
  const [endAt, setEndAt] = useState(null)

  const finish = useCallback(() => {
    setEndAt(null)
    setLeft(MODES[mode].min * 60000)
    if (mode === 'focus') setLog((l) => [...l, { ts: Date.now(), min: MODES.focus.min, subject }])
  }, [mode, subject, setLog])

  useEffect(() => {
    if (!endAt) return
    const t = setInterval(() => {
      const r = endAt - Date.now()
      if (r <= 0) finish()
      else setLeft(r)
    }, 250)
    return () => clearInterval(t)
  }, [endAt, finish])

  const running = endAt !== null
  const pick = (m) => {
    setMode(m)
    setEndAt(null)
    setLeft(MODES[m].min * 60000)
  }
  const start = () => setEndAt(Date.now() + left)
  const pause = () => {
    setLeft(Math.max(0, endAt - Date.now()))
    setEndAt(null)
  }
  const pct = Math.round((1 - left / (MODES[mode].min * 60000)) * 100)
  const today = todayStats(log)

  return (
    <>
      <PageHeader title="Focus timer" />
      <div className="mb-3 flex gap-2">
        {Object.entries(MODES).map(([k, m]) => (
          <Button key={k} solid={mode === k} className="flex-1 !px-2 text-[12.5px]" onClick={() => pick(k)}>
            {m.label}
          </Button>
        ))}
      </div>
      <Card className="text-center">
        <div className="text-[64px] font-light leading-none tracking-tight" role="timer" aria-live="off">{fmt(left)}</div>
        <div className="mx-auto my-4 h-2 max-w-[260px] overflow-hidden rounded-full bg-soft">
          <i className="block h-full bg-ink transition-[width]" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-center gap-2">
          {running ? <Button solid onClick={pause}>Pause</Button> : <Button solid onClick={start}>{left < MODES[mode].min * 60000 ? 'Resume' : 'Start'}</Button>}
          <Button onClick={() => pick(mode)}>Reset</Button>
        </div>
      </Card>
      {mode === 'focus' && (
        <Card>
          <h3 className="m-0 mb-2 text-[15px] font-semibold">Studying</h3>
          <div className="flex flex-wrap gap-2">
            {plan.subjects.map((s) => (
              <Button key={s.id} solid={subject === s.name} onClick={() => setSubject(subject === s.name ? '' : s.name)}>
                {s.name}
              </Button>
            ))}
          </div>
        </Card>
      )}
      <Card>
        <div className="flex justify-between"><span>Today</span><b>{today.min} min, {today.n} sessions</b></div>
        <div className="mt-1 flex justify-between"><span>Last 7 days</span><b>{weekMinutes(log)} min</b></div>
      </Card>
    </>
  )
}
