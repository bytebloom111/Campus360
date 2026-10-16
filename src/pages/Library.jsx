import { useState } from 'react'
import { useApp } from '../context/app-context'
import { useLocalStorage } from '../lib/storage'
import { BOOKS, MAX_RESERVE, HOLD_MS, availableCount } from '../lib/library'
import { Card, Badge, Button, PageHeader, inputClass } from '../components/ui'

const SUBJECTS = ['All', ...new Set(BOOKS.map((b) => b.subject))]

export default function Library() {
  const { session } = useApp()
  const [held, setHeld] = useLocalStorage(`c360.library.${session.phone}`, {}) // book id -> time reserved
  const [q, setQ] = useState('')
  const [sub, setSub] = useState('All')
  const ids = Object.keys(held)
  const list = BOOKS.filter(
    (b) => (sub === 'All' || b.subject === sub) && `${b.title} ${b.author}`.toLowerCase().includes(q.trim().toLowerCase()),
  )
  const reserve = (id) => setHeld((h) => ({ ...h, [id]: Date.now() }))
  const release = (id) => setHeld((h) => Object.fromEntries(Object.entries(h).filter(([k]) => k !== id)))

  return (
    <>
      <PageHeader title="Library" />
      {ids.length > 0 && (
        <Card className="bg-mint">
          <h3 className="m-0 mb-1 text-[15px] font-semibold">My reservations ({ids.length} of {MAX_RESERVE})</h3>
          {ids.map((id) => (
            <div key={id} className="flex items-center justify-between gap-2 py-0.5 text-[13px]">
              <span>{BOOKS.find((b) => b.id === id).title}</span>
              <span className="text-mute">Pick up by {new Date(held[id] + HOLD_MS).toLocaleDateString()}</span>
            </div>
          ))}
        </Card>
      )}
      <input aria-label="Search books" className={`${inputClass} mb-2`} placeholder="Search title or author" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mb-3 flex flex-wrap gap-2">
        {SUBJECTS.map((s) => <Button key={s} solid={sub === s} onClick={() => setSub(s)}>{s}</Button>)}
      </div>
      {list.length === 0 && <p className="text-mute">No books match.</p>}
      {list.map((b) => {
        const mine = ids.includes(b.id)
        const n = availableCount(b, mine)
        const can = mine || (n > 0 && ids.length < MAX_RESERVE)
        return (
          <Card key={b.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <b>{b.title}</b>
                <div className="text-[12.5px] text-mute">{b.author}, {b.subject}</div>
              </div>
              <Badge tone={n > 0 ? 'mint' : 'rose'}>{n > 0 ? `${n} of ${b.copies} in` : 'All issued'}</Badge>
            </div>
            <div className="mt-2">
              <Button solid={!mine} disabled={!can} onClick={() => (mine ? release(b.id) : reserve(b.id))}>
                {mine ? 'Cancel reservation' : 'Reserve'}
              </Button>
              {!mine && n > 0 && ids.length >= MAX_RESERVE && (
                <span className="ml-2 text-[12px] text-mute">Limit reached</span>
              )}
            </div>
          </Card>
        )
      })}
    </>
  )
}
