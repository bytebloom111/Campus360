import { useState } from 'react'
import { useNow } from '../lib/useNow'
import { BUILDINGS, QUICK, findPlaces, isOpen, hoursText } from '../lib/contacts'
import { Card, Badge, Button, PageHeader, inputClass } from '../components/ui'

export default function Contacts() {
  const now = useNow(60000)
  const [q, setQ] = useState('')
  const [bld, setBld] = useState('')
  const list = findPlaces(q, bld)

  return (
    <>
      <PageHeader title="Who to contact" />
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
            <div className="mt-2 flex items-center gap-2">
              <a href={`tel:${p.phone}`} className="rounded-2xl border border-ink bg-ink px-4 py-[9px] font-medium text-white no-underline">Call</a>
              <span className="text-[12.5px] text-mute">{p.phone}</span>
            </div>
          </Card>
        )
      })}
      <p className="text-[12px] text-mute">Sample directory. Names and numbers are placeholders.</p>
    </>
  )
}
