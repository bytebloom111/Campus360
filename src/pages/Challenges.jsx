import { useState } from 'react'
import { useApp } from '../context/app-context'
import { useChallenges, TASKS } from '../lib/challenges'
import { Card, Badge, Button, PageHeader } from '../components/ui'

export default function Challenges() {
  const { session, profile } = useApp()
  const { done, complete, divisions, branches } = useChallenges(session.phone, profile)
  const [view, setView] = useState('div')
  const [flash, setFlash] = useState(false)

  const rows = view === 'div' ? divisions : branches
  const max = rows[0].pts || 1
  const mine = (r) => (view === 'div' ? r.name === profile.division : r.name === profile.branch)

  function finish(id) {
    complete(id)
    setFlash(true)
    setTimeout(() => setFlash(false), 1300)
  }

  return (
    <>
      <PageHeader title="Class challenges" />
      <div className="mb-3 flex gap-2">
        <Button solid={view === 'div'} className="flex-1" onClick={() => setView('div')}>Divisions</Button>
        <Button solid={view === 'br'} className="flex-1" onClick={() => setView('br')}>Branches</Button>
      </div>
      <Card>
        {rows.map((r, i) => (
          <div
            key={r.name}
            className={`flex items-center gap-2 rounded-xl px-1 py-1.5 transition-colors duration-700 ${
              mine(r) ? 'font-semibold' : ''
            } ${mine(r) && flash ? 'bg-mint' : ''}`}
          >
            <span className="w-24 flex-none text-[13px]">{i + 1}. {r.name}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-soft">
              <i className={`block h-full ${mine(r) ? 'bg-ink' : 'bg-[#b79cf0]'}`} style={{ width: `${Math.round((r.pts / max) * 100)}%` }} />
            </div>
            <b className="w-10 text-right text-[13px]">{r.pts}</b>
          </div>
        ))}
        <p className="m-0 mt-2 text-[12px] text-mute">Sample points. Real ones are set at the event.</p>
      </Card>
      <h2 className="mx-1 mb-2 mt-4 text-[11px] font-medium uppercase tracking-[0.12em] text-mute">
        Open tasks for {profile.division}
      </h2>
      {TASKS.map((t) => (
        <Card key={t.id}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span>{t.title}</span>
            <Badge tone="lilac">{t.pts} pts</Badge>
          </div>
          <Button solid={!done.includes(t.id)} disabled={done.includes(t.id)} onClick={() => finish(t.id)}>
            {done.includes(t.id) ? 'Completed' : 'Mark complete'}
          </Button>
        </Card>
      ))}
    </>
  )
}
