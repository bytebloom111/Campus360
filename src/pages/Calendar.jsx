import { useState } from 'react'
import { useApp } from '../context/app-context'
import { useNow } from '../lib/useNow'
import { EVENTS, rankEvents } from '../lib/events'
import { useRegistrations } from '../lib/useRegistrations'
import { useDeadlines } from '../lib/useDeadlines'
import { daysAway, away, tone, toKey, startOfToday } from '../lib/deadlines'
import EventPoster from '../components/EventPoster'
import { Card, Badge, Button, PageHeader, inputClass } from '../components/ui'

const CELL = {
  rose: 'bg-[#ffb4b4] text-[#5a1010] font-semibold',
  sun: 'bg-[#ffe08f] text-[#5a4300] font-semibold',
  lilac: 'bg-[#d8c8fb] text-[#2d1a63] font-semibold',
  gray: 'bg-[#e1e5ed] font-semibold',
}
const LEGEND = [
  ['bg-[#ffb4b4]', '2 days away'],
  ['bg-[#ffe08f]', '1 week away'],
  ['bg-[#d8c8fb]', 'Later'],
]

export default function Calendar() {
  const { session, profile } = useApp()
  const now = useNow()
  const [reg, toggleReg] = useRegistrations(session.phone)
  const [deadlines, setDeadlines] = useDeadlines(session.phone)
  const [monthOffset, setMonthOffset] = useState(0)
  const [sel, setSel] = useState(null) // selected day, as 'YYYY-MM-DD'
  const [form, setForm] = useState({ title: '', date: '', note: '' })
  const [err, setErr] = useState('')

  const today = startOfToday()
  const first = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const y = first.getFullYear()
  const m = first.getMonth()
  const lead = first.getDay()
  const days = new Date(y, m + 1, 0).getDate()

  const items = [
    ...EVENTS.map((e) => ({ key: toKey(new Date(e.start)), title: e.title, kind: 'Event', note: e.venue })),
    ...deadlines.map((d) => ({ key: d.date, title: d.title, kind: 'Deadline', note: d.note, id: d.id })),
  ]
  const ranked = rankEvents(EVENTS, profile.interests || [], now)
  const dayItems = sel ? items.filter((i) => i.key === sel) : []

  function addDeadline() {
    if (!form.title.trim()) return setErr('Enter a title.')
    if (!form.date) return setErr('Pick a date.')
    setDeadlines([
      ...deadlines,
      { id: `d${Date.now()}`, title: form.title.trim(), date: form.date, note: form.note.trim() },
    ])
    setForm({ title: '', date: '', note: '' })
    setErr('')
  }

  return (
    <>
      <PageHeader title="Calendar and events" />

      <div className="mb-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
        {ranked.map((e) => (
          <EventPoster
            key={e.id}
            e={e}
            now={now}
            interests={profile.interests || []}
            registered={reg.includes(e.id)}
            onToggle={() => toggleReg(e.id)}
          />
        ))}
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <Button aria-label="Previous month" onClick={() => setMonthOffset(monthOffset - 1)}>&lt;</Button>
          <h3 className="m-0 text-[15px] font-semibold">
            {first.toLocaleString('en', { month: 'long' })} {y}
          </h3>
          <Button aria-label="Next month" onClick={() => setMonthOffset(monthOffset + 1)}>&gt;</Button>
        </div>
        <div className="grid grid-cols-7 gap-[5px] text-center text-[12.5px]">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <b key={i} className="text-[11px] font-medium text-mute">{d}</b>
          ))}
          {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
          {Array.from({ length: days }, (_, i) => {
            const key = toKey(new Date(y, m, i + 1))
            const off = daysAway(key)
            const has = items.some((x) => x.key === key)
            return (
              <button
                key={key}
                onClick={() => setSel(key)}
                className={`rounded-[14px] border-0 py-2 ${has ? CELL[tone(off)] : 'bg-soft'} ${
                  off === 0 ? 'shadow-[inset_0_0_0_1.5px_#16181d]' : ''
                } ${sel === key ? 'outline outline-2 outline-offset-1 outline-ink' : ''}`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3.5">
          {LEGEND.map(([c, t]) => (
            <span key={t} className="flex items-center gap-1.5 text-xs text-mute">
              <i className={`h-3 w-3 rounded-[5px] ${c}`} />
              {t}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        {!sel ? (
          <span className="text-mute">Tap a date to see what is planned.</span>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="m-0 text-[15px] font-semibold">
                {new Date(sel + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
              </h3>
              <Badge tone={tone(daysAway(sel))}>{daysAway(sel) < 0 ? 'Past' : away(daysAway(sel))}</Badge>
            </div>
            {dayItems.length === 0 && <p className="mb-0 mt-2 text-mute">Nothing planned on this day.</p>}
            {dayItems.map((x) => (
              <div key={x.title + x.kind} className="mt-3 flex items-center justify-between gap-2">
                <div>
                  <b>{x.title}</b>
                  <div className="text-[12.5px] text-mute">{x.note}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge tone={tone(daysAway(x.key))}>{x.kind}</Badge>
                  {x.id && (
                    <button
                      className="border-0 bg-transparent p-0 text-xs text-mute underline"
                      onClick={() => setDeadlines(deadlines.filter((d) => d.id !== x.id))}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </Card>

      <Card>
        <h3 className="m-0 mb-1 text-[15px] font-semibold">Add a deadline</h3>
        <input
          className={inputClass}
          placeholder="e.g. Physics assignment"
          aria-label="Deadline title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="date"
          className={inputClass}
          aria-label="Deadline date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Note (optional)"
          aria-label="Deadline note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
        {err && <p className="mb-0 mt-1"><Badge tone="rose">{err}</Badge></p>}
        <div className="mt-2">
          <Button solid onClick={addDeadline}>Add deadline</Button>
        </div>
      </Card>
    </>
  )
}
