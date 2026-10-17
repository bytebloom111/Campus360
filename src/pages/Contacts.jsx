import { useState } from 'react'
import { useNow } from '../lib/useNow'
import { BUILDINGS, QUICK, STATUS, findPlaces, findFaculty, isOpen, hoursText, ago } from '../lib/contacts'
import { Card, Badge, Button, PageHeader, inputClass } from '../components/ui'

function Offices() {
  const now = useNow(60000)
  const [q, setQ] = useState('')
  const [bld, setBld] = useState('')
  const list = findPlaces(q, bld)

  return (
    <>
      <input aria-label="What do you need" className={`${inputClass} mb-2`} placeholder="What do you need? e.g. fees" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK.map((x) => <Button key={x} solid={q.toLowerCase() === x.toLowerCase()} onClick={() => setQ(q.toLowerCase() === x.toLowerCase() ? '' : x)}>{x}</Button>)}
      </div>
      <Card>
        <svg viewBox="0 0 260 155" className="w-full" role="group" aria-label="Campus map. Tap a building to filter.">
          {BUILDINGS.map((b) => {
            const on = bld === b.id
            return (
              <g key={b.id} tabIndex={0} role="button" aria-pressed={on} aria-label={b.id}
                onClick={() => setBld(on ? '' : b.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setBld(on ? '' : b.id)}
                className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-sky-400">
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" className={on ? 'fill-lilac stroke-ink' : 'fill-soft stroke-line'} strokeWidth="1.5" />
                <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 4} textAnchor="middle" fontSize="11" className="fill-ink">{b.id}</text>
              </g>
            )
          })}
        </svg>
        <p className="m-0 mt-1 text-[12px] text-mute">
          Schematic, not to scale. {bld ? `Showing ${bld}.` : 'Tap a building to filter.'}
        </p>
      </Card>
      {list.length === 0 && <p className="text-mute">No office matches. Try the Admin office or the Student council.</p>}
      {list.map((p) => {
        const open = isOpen(p, now)
        return (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <b>{p.name}</b>
                <div className="text-[12.5px] text-mute">{p.who}</div>
              </div>
              <Badge tone={open ? 'mint' : 'rose'}>{open ? 'Open now' : 'Closed now'}</Badge>
            </div>
            <div className="mt-1 text-[13px]">{p.bld}, {p.where}</div>
            <div className="text-[12.5px] text-mute">{hoursText(p)}</div>
          </Card>
        )
      })}
      <p className="text-[12px] text-mute">Sample directory. Names are placeholders.</p>
    </>
  )
}

function Faculty() {
  const now = useNow(60000)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const list = findFaculty(q, status)

  return (
    <>
      <input aria-label="Search faculty" className={`${inputClass} mb-2`} placeholder="Search by name or subject" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mb-3 flex flex-wrap gap-2">
        <Button solid={!status} onClick={() => setStatus('')}>All</Button>
        {Object.entries(STATUS).map(([k, v]) => (
          <Button key={k} solid={status === k} onClick={() => setStatus(status === k ? '' : k)}>{v.label}</Button>
        ))}
      </div>
      {list.length === 0 && <p className="text-mute">No faculty match this filter.</p>}
      {list.map((f) => (
        <Card key={f.id}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <b>{f.name}</b>
              <div className="text-[12.5px] text-mute">{f.subject}, {f.cabin}</div>
            </div>
            <Badge tone={STATUS[f.status].tone}>{STATUS[f.status].label}</Badge>
          </div>
          <div className="mt-1 text-[13px]">{f.note}</div>
          <div className="text-[12px] text-mute">{ago(f.at, now)}</div>
        </Card>
      ))}
      <p className="text-[12px] text-mute">Sample updates. Faculty will post their own status.</p>
    </>
  )
}

export default function Contacts() {
  const [tab, setTab] = useState('offices')
  return (
    <>
      <PageHeader title="Who to contact" />
      <div className="mb-3 flex gap-2">
        <Button solid={tab === 'offices'} className="flex-1" onClick={() => setTab('offices')}>Offices</Button>
        <Button solid={tab === 'faculty'} className="flex-1" onClick={() => setTab('faculty')}>Faculty availability</Button>
      </div>
      {tab === 'offices' ? <Offices /> : <Faculty />}
    </>
  )
}
