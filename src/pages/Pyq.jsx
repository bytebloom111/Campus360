import { useState } from 'react'
import { useApp } from '../context/app-context'
import { useLocalStorage } from '../lib/storage'
import { PAPERS, PYQ_SUBJECTS, TOPICS } from '../lib/pyq'
import { Card, Badge, Button, PageHeader } from '../components/ui'

export default function Pyq() {
  const { session } = useApp()
  const [done, setDone] = useLocalStorage(`c360.pyq.${session.phone}`, [])
  const [sub, setSub] = useState(PYQ_SUBJECTS[0])
  const papers = PAPERS.filter((p) => p.subject === sub)
  const n = papers.filter((p) => done.includes(p.id)).length
  const toggle = (id) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  return (
    <>
      <PageHeader title="PYQs" />
      <div className="mb-3 flex flex-wrap gap-2">
        {PYQ_SUBJECTS.map((s) => <Button key={s} solid={sub === s} onClick={() => setSub(s)}>{s}</Button>)}
      </div>
      <Card>
        <div className="mb-1 flex justify-between"><b>Practised</b><span>{n} of {papers.length}</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-soft">
          <i className="block h-full bg-ink" style={{ width: `${(n / papers.length) * 100}%` }} />
        </div>
      </Card>
      {papers.map((p) => (
        <Card key={p.id}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <b>{p.subject} paper, {p.year}</b>
              <div className="text-[12.5px] text-mute">{p.exam}, {p.marks} marks</div>
            </div>
            {done.includes(p.id) && <Badge tone="mint">Done</Badge>}
          </div>
          <div className="mt-2 flex gap-2">
            {p.url && (
              <a href={p.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-line bg-white px-4 py-[9px] font-medium text-ink no-underline">Open</a>
            )}
            <Button solid={!done.includes(p.id)} onClick={() => toggle(p.id)}>
              {done.includes(p.id) ? 'Undo' : 'Mark practised'}
            </Button>
          </div>
        </Card>
      ))}
      <h2 className="mx-1 mb-2 mt-4 text-[11px] font-medium uppercase tracking-[0.12em] text-mute">Most asked topics</h2>
      <Card>
        {TOPICS[sub].map(([t, c]) => (
          <div key={t} className="flex items-center gap-2 py-1 text-[13px]">
            <span className="w-36 flex-none">{t}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-soft"><i className="block h-full bg-[#b79cf0]" style={{ width: `${(c / 4) * 100}%` }} /></div>
            <span className="w-8 text-right text-mute">{c}/4</span>
          </div>
        ))}
        <p className="m-0 mt-2 text-[12px] text-mute">Sample counts from the last 4 papers.</p>
      </Card>
    </>
  )
}
