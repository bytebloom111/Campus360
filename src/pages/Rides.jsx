import { useState } from 'react'
import { useApp } from '../context/app-context'
import { useNow } from '../lib/useNow'
import { useRides, rideStatus, fareEach, minsLeft, VEHICLES, SEATS } from '../lib/rides'
import { Card, Badge, Button, PageHeader, inputClass } from '../components/ui'

const TONE = { Open: 'mint', Full: 'lilac', Expired: 'rose', Cancelled: 'rose' }

export default function Rides() {
  const { session } = useApp()
  const now = useNow(10000)
  const { rides, post, request, join, cancel } = useRides(session.phone)
  const [open, setOpen] = useState(false)
  const [to, setTo] = useState('Kurla station')
  const [v, setV] = useState(VEHICLES[0])
  const [fare, setFare] = useState(120)

  function submit() {
    post(to, v, Number(fare))
    setOpen(false)
  }

  return (
    <>
      <PageHeader title="Rides" />
      <Button solid className="mb-3" onClick={() => setOpen((o) => !o)}>
        {open ? 'Close' : 'Post a ride'}
      </Button>
      {open && (
        <Card>
          <label className="text-[12.5px] text-mute" htmlFor="ft">Going to</label>
          <input id="ft" className={inputClass} value={to} onChange={(e) => setTo(e.target.value)} />
          <label className="text-[12.5px] text-mute" htmlFor="fv">Vehicle</label>
          <select id="fv" className={inputClass} value={v} onChange={(e) => setV(e.target.value)}>
            {VEHICLES.map((x) => <option key={x}>{x}</option>)}
          </select>
          {v !== 'Sharing auto' && (
            <>
              <label className="text-[12.5px] text-mute" htmlFor="fa">Estimated total fare (Rs)</label>
              <input id="fa" type="number" min="0" className={inputClass} value={fare} onChange={(e) => setFare(e.target.value)} />
            </>
          )}
          <p className="mb-3 mt-2 text-[12.5px] text-mute">You take 1 of {SEATS} seats. The ride expires in 15 minutes.</p>
          <Button solid onClick={submit}>Post ride</Button>
        </Card>
      )}
      {rides.map((r) => {
        const st = rideStatus(r, now)
        return (
          <Card key={r.id}>
            <div className="flex items-center justify-between gap-2">
              <b>VESIT to {r.to}</b>
              <Badge tone={TONE[st]}>{st}</Badge>
            </div>
            <div className="text-[12.5px] text-mute">
              {r.v}, posted by {r.by}{st === 'Open' ? `, ${minsLeft(r, now)} min left` : ''}
            </div>
            <div className="my-2 flex items-center justify-between">
              <span className="flex gap-1.5" aria-label={`${r.n} of ${SEATS} seats filled`}>
                {Array.from({ length: SEATS }, (_, k) => (
                  <i key={k} className={`h-3.5 w-3.5 rounded-full border-2 border-ink ${k < r.n ? 'bg-ink' : ''}`} />
                ))}
              </span>
              <span><b>Rs {fareEach(r)}</b> each</span>
            </div>
            {r.mine ? (
              st === 'Open' && (
                <div className="flex gap-2">
                  <Button onClick={() => join(r.id)}>Simulate a join</Button>
                  <Button onClick={() => cancel(r.id)}>Cancel ride</Button>
                </div>
              )
            ) : r.req === 'Confirmed' ? (
              <Badge tone="mint">Confirmed</Badge>
            ) : r.req === 'Requested' ? (
              <Badge tone="sun">Requested</Badge>
            ) : (
              st === 'Open' && <Button solid onClick={() => request(r.id)}>Request seat</Button>
            )}
          </Card>
        )
      })}
    </>
  )
}
