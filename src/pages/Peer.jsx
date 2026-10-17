import { useState } from 'react'
import { useApp } from '../context/app-context'
import { usePeer } from '../lib/credits'
import { OFFERS, WANTS, FIRM_VOTES, rankTeachers } from '../lib/peer'
import { Card, Badge, Button, PageHeader, inputClass } from '../components/ui'

function Stars({ value = 0, onPick }) {
  return (
    <span className="inline-flex gap-1" role="group" aria-label="Rate this session">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="border-0 bg-transparent p-0 text-[28px] leading-none text-ink"
          onClick={() => onPick(n)}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </span>
  )
}

const Heading = ({ children }) => <h3 className="mb-2 mt-4 text-[15px] font-semibold">{children}</h3>

export default function Peer() {
  const { session } = useApp()
  const [st, setSt] = usePeer(session.phone)
  const [tab, setTab] = useState('explore')
  const [adding, setAdding] = useState(false)
  const [kind, setKind] = useState('offer')
  const [skill, setSkill] = useState('')
  const [slot, setSlot] = useState('')

  // Older saved data may not have these two fields yet.
  const attended = st.attended ?? []
  const ratings = st.ratings ?? {}
  const ranked = rankTeachers(OFFERS, ratings)
  const taught = st.offers.reduce((a, o) => a + (o.taken || 0), 0)
  const learning = OFFERS.filter((o) => st.booked.includes(o.id))

  const book = (id) => setSt((s) => (s.credits < 1 || s.booked.includes(id) ? s : { ...s, credits: s.credits - 1, booked: [...s.booked, id] }))
  const help = (id) => setSt((s) => (s.helping.includes(id) ? s : { ...s, helping: [...s.helping, id] }))
  const earn = (id) => setSt((s) => ({ ...s, credits: s.credits + 1, offers: s.offers.map((o) => (o.id === id ? { ...o, taken: (o.taken || 0) + 1 } : o)) }))
  const attend = (id) => setSt((s) => ((s.attended ?? []).includes(id) ? s : { ...s, attended: [...(s.attended ?? []), id] }))
  const rate = (id, n) => setSt((s) => ({ ...s, ratings: { ...(s.ratings ?? {}), [id]: n } }))
  function post() {
    if (!skill.trim()) return
    const item = { id: 'p' + Date.now(), skill: skill.trim(), slot: slot.trim() || 'Flexible' }
    setSt((s) => (kind === 'offer' ? { ...s, offers: [item, ...s.offers] } : { ...s, wants: [item, ...s.wants] }))
    setSkill('')
    setSlot('')
    setAdding(false)
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
        <Button solid={tab === 'explore'} className="flex-1" onClick={() => setTab('explore')}>Explore</Button>
        <Button solid={tab === 'sessions'} className="flex-1" onClick={() => setTab('sessions')}>My sessions</Button>
      </div>

      {tab === 'explore' && (
        <>
          <h3 className="mb-1 mt-1 text-[15px] font-semibold">Top teachers</h3>
          <p className="mb-2 mt-0 text-[12px] text-mute">
            A rank is a rough estimate at first. It becomes firm once {FIRM_VOTES} learners have rated. You can rate after you attend a session.
          </p>
          {ranked.map((o) => (
            <Card key={o.id}>
              <div className="flex items-start gap-3">
                <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full font-semibold ${o.rank === 1 ? 'bg-sun' : 'bg-soft'}`}>
                  #{o.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <b>{o.skill}</b>
                    <Badge tone={o.firm ? 'mint' : 'sun'}>{o.firm ? 'Rated' : 'Rough rank'}</Badge>
                  </div>
                  <div className="text-[12.5px] text-mute">{o.by}, {o.slot}</div>
                  <div className="mt-1 text-[12.5px]">
                    {o.avg === null ? 'No ratings yet' : `★ ${o.avg.toFixed(1)} from ${o.votes} rating${o.votes === 1 ? '' : 's'}`}
                    <span className="text-mute">, {o.taught} sessions taught</span>
                  </div>
                  {o.mine > 0 && <div className="text-[12px] text-mute">Your rating: {'★'} {o.mine}</div>}
                </div>
              </div>
              <div className="mt-2">
                {st.booked.includes(o.id) ? <Badge tone="mint">Booked</Badge> : (
                  <Button solid disabled={st.credits < 1} onClick={() => book(o.id)}>{st.credits < 1 ? 'No credits left' : 'Book for 1 credit'}</Button>
                )}
              </div>
            </Card>
          ))}

          <Heading>Requests from learners</Heading>
          {WANTS.concat(st.wants).map((w) => (
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
        </>
      )}

      {tab === 'sessions' && (
        <>
          <div className="mb-3 grid grid-cols-3 gap-3">
            {[
              ['Credits', st.credits],
              ['Hours taught', taught],
              ['Sessions attended', attended.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-line bg-white p-3">
                <b className="block text-2xl font-medium">{value}</b>
                <span className="text-[11.5px] text-mute">{label}</span>
              </div>
            ))}
          </div>

          <h3 className="mb-2 mt-1 text-[15px] font-semibold">Learning</h3>
          {learning.length === 0 && <p className="mt-0 text-[12.5px] text-mute">Nothing booked yet. Book a teacher in Explore.</p>}
          {learning.map((o) => (
            <Card key={o.id}>
              <b>{o.skill}</b>
              <div className="text-[12.5px] text-mute">{o.by}, {o.slot}</div>
              <div className="mt-2">
                {!attended.includes(o.id) ? (
                  <Button onClick={() => attend(o.id)}>Mark as attended</Button>
                ) : ratings[o.id] ? (
                  <Badge tone="mint">You rated {'★'} {ratings[o.id]}</Badge>
                ) : (
                  <>
                    <div className="mb-1 text-[12.5px]">How was the session?</div>
                    <Stars onPick={(n) => rate(o.id, n)} />
                  </>
                )}
              </div>
            </Card>
          ))}

          <Heading>Teaching</Heading>
          {st.offers.length === 0 && <p className="mt-0 text-[12.5px] text-mute">You are not teaching anything yet. Tap + to offer a skill.</p>}
          {st.offers.map((o) => (
            <Card key={o.id}>
              <div className="flex justify-between gap-2"><b>{o.skill}</b><Badge tone="lilac">Teaching</Badge></div>
              <div className="text-[12.5px] text-mute">{o.slot}{o.taken ? `, ${o.taken} taught` : ''}</div>
              <div className="mt-2"><Button onClick={() => earn(o.id)}>Simulate a booking</Button></div>
            </Card>
          ))}

          {st.wants.length > 0 && (
            <>
              <Heading>Your learning requests</Heading>
              {st.wants.map((w) => (
                <Card key={w.id}>
                  <b>{w.skill}</b>
                  <div className="text-[12.5px] text-mute">{w.slot}</div>
                </Card>
              ))}
            </>
          )}

          {adding ? (
            <Card>
              <div className="mb-2 flex gap-2">
                <Button solid={kind === 'offer'} onClick={() => setKind('offer')}>I can teach</Button>
                <Button solid={kind === 'want'} onClick={() => setKind('want')}>I want to learn</Button>
              </div>
              <label className="text-[12.5px] text-mute" htmlFor="sk">Skill or topic</label>
              <input id="sk" className={inputClass} value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. Java basics" />
              <label className="text-[12.5px] text-mute" htmlFor="sl">Preferred time</label>
              <input id="sl" className={inputClass} value={slot} onChange={(e) => setSlot(e.target.value)} placeholder="e.g. Sat, 5 pm" />
              <div className="mt-2 flex gap-2">
                <Button solid disabled={!skill.trim()} onClick={post}>Post</Button>
                <Button onClick={() => setAdding(false)}>Cancel</Button>
              </div>
            </Card>
          ) : (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                aria-label="Offer a skill or ask to learn one"
                onClick={() => setAdding(true)}
                className="flex h-14 w-14 items-center justify-center rounded-full border-0 bg-ink text-[30px] font-light leading-none text-white shadow-[0_10px_24px_rgba(22,24,29,0.25)] transition active:scale-95"
              >
                +
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
