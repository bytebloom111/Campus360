import { useState } from 'react'
import { useApp } from '../context/app-context'
import { usePeer } from '../lib/credits'
import { OFFERS, WANTS } from '../lib/peer'
import { Card, Badge, Button, PageHeader, inputClass } from '../components/ui'

export default function Peer() {
  const { session } = useApp()
  const [st, setSt] = usePeer(session.phone)
  const [tab, setTab] = useState('offers')
  const [kind, setKind] = useState('offer')
  const [skill, setSkill] = useState('')
  const [slot, setSlot] = useState('')

  const book = (id) => setSt((s) => (s.credits < 1 || s.booked.includes(id) ? s : { ...s, credits: s.credits - 1, booked: [...s.booked, id] }))
  const help = (id) => setSt((s) => (s.helping.includes(id) ? s : { ...s, helping: [...s.helping, id] }))
  const earn = (id) => setSt((s) => ({ ...s, credits: s.credits + 1, offers: s.offers.map((o) => (o.id === id ? { ...o, taken: (o.taken || 0) + 1 } : o)) }))
  function post() {
    if (!skill.trim()) return
    const item = { id: 'p' + Date.now(), skill: skill.trim(), slot: slot.trim() || 'Flexible' }
    setSt((s) => (kind === 'offer' ? { ...s, offers: [item, ...s.offers] } : { ...s, wants: [item, ...s.wants] }))
    setSkill('')
    setSlot('')
  }

  return (
    <>
      <PageHeader title="Peer learning" />
      <Card className="bg-lilac">
        <div className="flex items-center justify-between">
          <div><b className="text-[28px] font-medium">{st.credits}</b> <span>time credits</span></div>
          <span className="text-[12.5px]">1 credit = 1 hour</span>
        </div>
        <p className="m-0 text-[12.5px]">Teach for an hour to earn a credit. Spend one to learn.</p>
      </Card>
      <div className="mb-3 flex gap-2">
        <Button solid={tab === 'offers'} className="flex-1" onClick={() => setTab('offers')}>Offers</Button>
        <Button solid={tab === 'wants'} className="flex-1" onClick={() => setTab('wants')}>Wanted</Button>
        <Button solid={tab === 'mine'} className="flex-1" onClick={() => setTab('mine')}>Mine</Button>
      </div>
      {tab === 'offers' && OFFERS.map((o) => (
        <Card key={o.id}>
          <b>{o.skill}</b>
          <div className="text-[12.5px] text-mute">{o.by}, {o.slot}</div>
          <div className="mt-2">
            {st.booked.includes(o.id) ? <Badge tone="mint">Booked</Badge> : (
              <Button solid disabled={st.credits < 1} onClick={() => book(o.id)}>{st.credits < 1 ? 'No credits left' : 'Book for 1 credit'}</Button>
            )}
          </div>
        </Card>
      ))}
      {tab === 'wants' && WANTS.concat(st.wants).map((w) => (
        <Card key={w.id}>
          <b>{w.skill}</b>
          <div className="text-[12.5px] text-mute">{w.by || 'You'}{w.slot ? `, ${w.slot}` : ''}</div>
          {w.by && (
            <div className="mt-2">
              {st.helping.includes(w.id) ? <Badge tone="mint">You offered</Badge> : <Button onClick={() => help(w.id)}>I can teach this</Button>}
            </div>
          )}
        </Card>
      ))}
      {tab === 'mine' && (
        <>
          <Card>
            <div className="mb-2 flex gap-2">
              <Button solid={kind === 'offer'} onClick={() => setKind('offer')}>I can teach</Button>
              <Button solid={kind === 'want'} onClick={() => setKind('want')}>I want to learn</Button>
            </div>
            <label className="text-[12.5px] text-mute" htmlFor="sk">Skill or topic</label>
            <input id="sk" className={inputClass} value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. Java basics" />
            <label className="text-[12.5px] text-mute" htmlFor="sl">Preferred time</label>
            <input id="sl" className={inputClass} value={slot} onChange={(e) => setSlot(e.target.value)} placeholder="e.g. Sat, 5 pm" />
            <div className="mt-2"><Button solid disabled={!skill.trim()} onClick={post}>Post</Button></div>
          </Card>
          {st.offers.map((o) => (
            <Card key={o.id}>
              <div className="flex justify-between gap-2"><b>{o.skill}</b><Badge tone="lilac">Teaching</Badge></div>
              <div className="text-[12.5px] text-mute">{o.slot}{o.taken ? `, ${o.taken} taught` : ''}</div>
              <div className="mt-2"><Button onClick={() => earn(o.id)}>Simulate a booking</Button></div>
            </Card>
          ))}
          {st.wants.length > 0 && <p className="text-[12.5px] text-mute">Your learning requests are under Wanted.</p>}
        </>
      )}
    </>
  )
}
