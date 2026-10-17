import { useState } from 'react'
import { useApp } from '../context/app-context'
import { useLocalStorage } from '../lib/storage'
import {
  DEFAULT_SCALE, DEFAULT_SUBJECTS, gradeStatus, passInfo, checkTarget,
} from '../lib/planner'
import { trend, cgpaWith, MAX_SEMS } from '../lib/cgpa'
import { Card, Badge, Button, PageHeader, inputClass } from '../components/ui'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

function Num({ label, value, onChange, min = 0, max, step = 1 }) {
  return (
    <input
      type="number"
      aria-label={label}
      className="w-20 rounded-xl border border-transparent bg-soft px-2 py-1 text-right focus:border-sky-200 focus:bg-white focus:outline-none"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
    />
  )
}

function SubjectForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState({
    name: '', credits: 3, internalMax: 40, finalMax: 60, passTotal: 40, passFinalMin: 0, ...initial,
  })
  const [err, setErr] = useState('')
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))

  function submit() {
    const total = f.internalMax + f.finalMax
    if (!f.name.trim()) return setErr('Enter the subject name.')
    if (f.credits <= 0) return setErr('Credits must be more than 0.')
    if (f.finalMax <= 0) return setErr('The final exam needs a maximum above 0.')
    if (f.passTotal > total) return setErr(`The pass mark cannot be above the total of ${total}.`)
    if (f.passFinalMin > f.finalMax) return setErr('The final-exam minimum cannot be above the final maximum.')
    onSave({ ...f, name: f.name.trim() })
  }

  const rows = [
    ['credits', 'Credits', 1],
    ['internalMax', 'Internal exam maximum', 0],
    ['finalMax', 'Final exam maximum', 1],
    ['passTotal', 'Pass mark (total)', 0],
    ['passFinalMin', 'Minimum in final exam (0 if none)', 0],
  ]
  return (
    <Card>
      <label className="text-[12.5px] text-mute" htmlFor="sn">Subject name</label>
      <input id="sn" className={inputClass} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      {rows.map(([k, label, min]) => (
        <div key={k} className="mt-2 flex items-center justify-between gap-2">
          <span>{label}</span>
          <Num label={label} value={f[k]} min={min} onChange={set(k)} />
        </div>
      ))}
      {err && <p className="mb-0 mt-2"><Badge tone="rose">{err}</Badge></p>}
      <div className="mt-3 flex gap-2">
        <Button solid onClick={submit}>Save subject</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </Card>
  )
}

const CHIP = {
  locked: 'bg-gray-200 text-mute',
  secured: 'bg-mint',
  open: 'bg-soft',
}

function SubjectCard({ s, scale, onInternal, onEdit, onDelete }) {
  const pass = passInfo(s)
  const sorted = [...scale].sort((a, b) => b.minPct - a.minPct)
  return (
    <Card>
      <div className="flex items-center justify-between">
        <b>{s.name}</b>
        <span className="text-[12.5px] text-mute">{s.credits} credits</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span>Internal (of {s.internalMax})</span>
        <Num label={`${s.name} internal marks`} value={s.internal} max={s.internalMax} onChange={onInternal} />
      </div>
      <p className="mb-1 mt-3 text-[12.5px] font-semibold">What you need in the final exam</p>
      <p className="mb-1 mt-0 text-[12px] text-mute">Worked out from your saved internal marks.</p>
      <div className="flex flex-wrap gap-1.5">
        {sorted.map((gr) => {
          const st = gradeStatus(s, gr)
          const text = st.state === 'locked' ? `${gr.grade} locked` : st.state === 'secured' ? `${gr.grade} secured` : `${gr.grade}: ${st.need} of ${s.finalMax}`
          return (
            <span key={gr.grade} className={`rounded-full px-3 py-[3px] text-[12px] font-medium ${CHIP[st.state]}`}>
              {text}
            </span>
          )
        })}
      </div>
      <p className="mb-0 mt-2 text-[12.5px]">
        {!pass.canPass
          ? 'Pass: not reachable, even with full marks in the final.'
          : pass.secured
            ? 'Pass: secured.'
            : `Pass: you need at least ${pass.need} in the final.`}
      </p>
      <div className="mt-3 flex gap-2">
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onDelete}>Delete</Button>
      </div>
    </Card>
  )
}

function CgpaTrend({ sems, onChange, target, curCredits }) {
  const pts = trend(sems)
  const proj = sems.length && curCredits > 0 && target > 0 ? cgpaWith(sems, target, curCredits) : null
  const N = pts.length + (proj === null ? 0 : 1)
  const vals = pts.flatMap((p) => [p.sgpa, p.cgpa]).concat(proj === null ? [] : [proj])
  const lo = vals.length ? Math.max(0, Math.floor(Math.min(...vals)) - 1) : 0
  const hi = 10
  const W = 300, H = 160, L = 28, R = 14, T = 12, B = 26
  const X = (i) => (N > 1 ? L + (i * (W - L - R)) / (N - 1) : L + (W - L - R) / 2)
  const Y = (v) => T + ((hi - v) / (hi - lo)) * (H - T - B)
  const path = (key) => pts.map((p, i) => `${X(i)},${Y(p[key])}`).join(' ')
  const ticks = Array.from({ length: hi - lo + 1 }, (_, k) => lo + k)
  const last = pts[pts.length - 1]
  const edit = (id, changes) => onChange(sems.map((x) => (x.id === id ? { ...x, ...changes } : x)))
  const add = () => {
    const prev = sems[sems.length - 1]
    onChange([...sems, { id: `g${Date.now()}`, sgpa: prev ? prev.sgpa : 8, credits: prev ? prev.credits : 20 }])
  }

  return (
    <Card className="mt-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="m-0 text-[15px] font-semibold">CGPA trend</h3>
          <p className="m-0 text-[12px] text-mute">Add the SGPA of each finished semester.</p>
        </div>
        {last && (
          <div className="text-right">
            <b className="text-2xl font-semibold">{last.cgpa.toFixed(2)}</b>
            <div className="text-[11.5px] text-mute">CGPA so far</div>
          </div>
        )}
      </div>

      {sems.length === 0 ? (
        <p className="mb-0 mt-3 text-[12.5px] text-mute">Nothing added yet. Add your first semester to see the trend.</p>
      ) : (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="Line chart of SGPA and CGPA for each semester">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} className="stroke-line" strokeWidth="1" />
                <text x={L - 6} y={Y(t) + 3.5} textAnchor="end" fontSize="9.5" className="fill-mute">{t}</text>
              </g>
            ))}
            {pts.map((p, i) => (
              <text key={p.sem} x={X(i)} y={H - 8} textAnchor="middle" fontSize="9.5" className="fill-mute">S{p.sem}</text>
            ))}
            {proj !== null && (
              <text x={X(N - 1)} y={H - 8} textAnchor="middle" fontSize="9.5" className="fill-mute">Goal</text>
            )}
            {pts.length > 1 && <polyline points={path('sgpa')} fill="none" className="stroke-sky-400" strokeWidth="2" strokeLinejoin="round" />}
            {pts.length > 1 && <polyline points={path('cgpa')} fill="none" className="stroke-ink" strokeWidth="2.5" strokeLinejoin="round" />}
            {proj !== null && (
              <line x1={X(pts.length - 1)} y1={Y(last.cgpa)} x2={X(N - 1)} y2={Y(proj)} className="stroke-ink" strokeWidth="2" strokeDasharray="4 4" />
            )}
            {pts.map((p, i) => (
              <g key={p.sem}>
                <circle cx={X(i)} cy={Y(p.sgpa)} r="3.5" className="fill-sky-400" />
                <circle cx={X(i)} cy={Y(p.cgpa)} r="3.5" className="fill-ink" />
              </g>
            ))}
            {proj !== null && (
              <>
                <circle cx={X(N - 1)} cy={Y(proj)} r="4" className="fill-white stroke-ink" strokeWidth="2" />
                <text x={X(N - 1)} y={Y(proj) - 8} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-ink">{proj.toFixed(2)}</text>
              </>
            )}
          </svg>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-mute">
            <span className="flex items-center gap-1.5"><i className="h-[3px] w-4 rounded bg-sky-400" />SGPA</span>
            <span className="flex items-center gap-1.5"><i className="h-[3px] w-4 rounded bg-ink" />CGPA</span>
            {proj !== null && <span className="flex items-center gap-1.5"><i className="h-[10px] w-[10px] rounded-full border-2 border-ink bg-white" />CGPA if you reach {target} this semester</span>}
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-2 gap-y-1.5 text-[12.5px]">
            <span className="text-mute">Semester</span>
            <span className="text-right text-mute">SGPA</span>
            <span className="text-right text-mute">Credits</span>
            <span />
            {sems.map((x, i) => (
              <div key={x.id} className="contents">
                <span>Semester {i + 1}</span>
                <Num label={`Semester ${i + 1} SGPA`} value={x.sgpa} max={10} step={0.01} onChange={(v) => edit(x.id, { sgpa: clamp(v, 0, 10) })} />
                <Num label={`Semester ${i + 1} credits`} value={x.credits} min={1} onChange={(v) => edit(x.id, { credits: Math.max(1, v) })} />
                <button type="button" aria-label={`Remove semester ${i + 1}`} className="border-0 bg-transparent px-1 text-[12px] text-mute underline" onClick={() => onChange(sems.filter((y) => y.id !== x.id))}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="mt-3">
        <Button disabled={sems.length >= MAX_SEMS} onClick={add}>Add semester</Button>
      </div>
    </Card>
  )
}

export default function Planner() {
  const { session } = useApp()
  const [data, setData] = useLocalStorage(`c360.planner.${session.phone}`, {
    subjects: DEFAULT_SUBJECTS, scale: DEFAULT_SCALE, target: 8.5,
  })
  const [sems, setSems] = useLocalStorage(`c360.cgpa.${session.phone}`, [])
  const { subjects, target } = data
  const scale = DEFAULT_SCALE // cutoffs are fixed; they are set at the event
  const [editing, setEditing] = useState(null) // null | 'new' | subject id
  const patch = (p) => setData((d) => ({ ...d, ...p }))

  const result = checkTarget(subjects, scale, target)

  const updateSubject = (id, changes) =>
    patch({ subjects: subjects.map((s) => (s.id === id ? { ...s, ...changes } : s)) })

  function saveSubject(values) {
    if (editing === 'new') {
      patch({ subjects: [...subjects, { ...values, id: `s${Date.now()}`, internal: 0 }] })
    } else {
      patch({
        subjects: subjects.map((s) =>
          s.id === editing ? { ...s, ...values, internal: Math.min(s.internal, values.internalMax) } : s,
        ),
      })
    }
    setEditing(null)
  }

  return (
    <>
      <PageHeader title="Planner" />
      <Card>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="tg">Target SGPA</label>
          <Num label="Target SGPA" value={target} min={0} max={10} step={0.1} onChange={(v) => patch({ target: clamp(v, 0, 10) })} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Badge tone={result.ok ? 'mint' : 'rose'}>{result.ok ? 'Achievable' : 'Not achievable'}</Badge>
          <span>Best possible (full marks in every final): <b>{result.best.toFixed(2)}</b></span>
        </div>
        {result.reason && <p className="mb-0 mt-2 text-[12.5px] text-mute">{result.reason}</p>}
      </Card>

      {subjects.map((s) =>
        editing === s.id ? (
          <SubjectForm key={s.id} initial={s} onSave={saveSubject} onCancel={() => setEditing(null)} />
        ) : (
          <SubjectCard
            key={s.id}
            s={s}
            scale={scale}
            onInternal={(v) => updateSubject(s.id, { internal: clamp(v, 0, s.internalMax) })}
            onEdit={() => setEditing(s.id)}
            onDelete={() => patch({ subjects: subjects.filter((x) => x.id !== s.id) })}
          />
        ),
      )}

      {editing === 'new' ? (
        <SubjectForm onSave={saveSubject} onCancel={() => setEditing(null)} />
      ) : (
        <Button solid onClick={() => setEditing('new')}>Add subject</Button>
      )}

      <CgpaTrend sems={sems} onChange={setSems} target={target} curCredits={subjects.reduce((a, x) => a + x.credits, 0)} />
    </>
  )
}
