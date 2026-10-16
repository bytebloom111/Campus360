import { useState } from 'react'
import { useApp } from '../context/app-context'
import { useLocalStorage } from '../lib/storage'
import {
  DEFAULT_SCALE, DEFAULT_SUBJECTS, gradeStatus, passInfo, gradeFor, sgpa, checkTarget,
} from '../lib/planner'
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

function SubjectCard({ s, scale, final, onInternal, onWhatIf, onEdit, onDelete }) {
  const pass = passInfo(s)
  const g = gradeFor(s, scale, final)
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
      <div className="mt-3">
        <div className="flex items-center justify-between text-[12.5px]">
          <span>What-if final: <b>{final}</b> of {s.finalMax}</span>
          <Badge tone={g.grade === 'F' ? 'rose' : 'mint'}>{g.grade === 'F' ? 'Fail' : `Grade ${g.grade}`}</Badge>
        </div>
        <input
          type="range"
          aria-label={`${s.name} what-if final marks`}
          className="w-full"
          min={0}
          max={s.finalMax}
          value={final}
          onChange={(e) => onWhatIf(Number(e.target.value))}
        />
      </div>
      <p className="mb-1 mt-3 text-[12.5px] text-mute">Marks needed in the final</p>
      <div className="flex flex-wrap gap-1.5">
        {sorted.map((gr) => {
          const st = gradeStatus(s, gr)
          const text = st.state === 'locked' ? `${gr.grade} locked` : st.state === 'secured' ? `${gr.grade} secured` : `${gr.grade}: ${st.need}`
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

export default function Planner() {
  const { session } = useApp()
  const [data, setData] = useLocalStorage(`c360.planner.${session.phone}`, {
    subjects: DEFAULT_SUBJECTS, scale: DEFAULT_SCALE, target: 8.5, whatIf: {},
  })
  const { subjects, scale, target, whatIf } = data
  const [editing, setEditing] = useState(null) // null | 'new' | subject id
  const [showScale, setShowScale] = useState(false)
  const patch = (p) => setData((d) => ({ ...d, ...p }))

  // What-if scores live apart from the saved marks, so they never change them.
  const finals = subjects.map((s) => clamp(whatIf[s.id] ?? Math.round(s.finalMax * 0.6), 0, s.finalMax))
  const result = checkTarget(subjects, scale, target)
  const whatIfResult = sgpa(subjects, scale, finals)

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
          <span>Best possible: <b>{result.best.toFixed(2)}</b></span>
        </div>
        {result.reason && <p className="mb-0 mt-2 text-[12.5px] text-mute">{result.reason}</p>}
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span>What-if SGPA</span>
          <b>{whatIfResult.sgpa.toFixed(2)}</b>
        </div>
        {whatIfResult.failed.length > 0 && (
          <p className="mb-0 mt-1 text-[12.5px] text-mute">
            In this what-if you fail: {whatIfResult.failed.join(', ')}.
          </p>
        )}
        <p className="mb-0 mt-1 text-[12px] text-mute">Move the sliders below to try scores. Your saved marks stay the same.</p>
      </Card>

      {subjects.map((s, i) =>
        editing === s.id ? (
          <SubjectForm key={s.id} initial={s} onSave={saveSubject} onCancel={() => setEditing(null)} />
        ) : (
          <SubjectCard
            key={s.id}
            s={s}
            scale={scale}
            final={finals[i]}
            onInternal={(v) => updateSubject(s.id, { internal: clamp(v, 0, s.internalMax) })}
            onWhatIf={(v) => patch({ whatIf: { ...whatIf, [s.id]: v } })}
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

      <Card className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-[15px] font-semibold">Grade cutoffs</h3>
          <Button onClick={() => setShowScale(!showScale)}>{showScale ? 'Hide' : 'Edit'}</Button>
        </div>
        {showScale && (
          <>
            <p className="mb-2 mt-2 text-[12.5px] text-mute">Minimum percentage of the total marks for each grade.</p>
            {scale.map((g) => (
              <div key={g.grade} className="mt-1 flex items-center justify-between">
                <span>{g.grade} ({g.points} points)</span>
                <Num
                  label={`${g.grade} cutoff percent`}
                  value={g.minPct}
                  max={100}
                  onChange={(v) => patch({ scale: scale.map((x) => (x.grade === g.grade ? { ...x, minPct: clamp(v, 0, 100) } : x)) })}
                />
              </div>
            ))}
            <div className="mt-3">
              <Button onClick={() => patch({ scale: DEFAULT_SCALE })}>Reset to sample cutoffs</Button>
            </div>
          </>
        )}
      </Card>
    </>
  )
}
