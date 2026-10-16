import { Link } from 'react-router-dom'
import { useApp } from '../context/app-context'
import { useLocalStorage } from '../lib/storage'
import { MODULES, GROUPS } from '../lib/modules'
import { DEFAULT_PLANNER, sgpa, gradeStatus } from '../lib/planner'
import Icon from '../components/Icon'
import { Badge } from '../components/ui'

// Tile icon backgrounds repeat pink, blue, white, like the prototype.
const ICON_BG = [
  'bg-[linear-gradient(135deg,#f1e4ff,#fbd3ea)]',
  'bg-[linear-gradient(135deg,#c4f3fb,#93d6f5)]',
  'bg-white border border-line',
]

export default function Home() {
  const { profile, session } = useApp()
  const [plan] = useLocalStorage(`c360.planner.${session.phone}`, DEFAULT_PLANNER)
  const { subjects, scale, whatIf } = plan

  const first = profile.name.split(' ')[0]
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Projected SGPA from the planner's what-if scores.
  const finals = subjects.map((s) =>
    Math.min(s.finalMax, Math.max(0, whatIf[s.id] ?? Math.round(s.finalMax * 0.6))),
  )
  const projected = sgpa(subjects, scale, finals).sgpa

  // The subject with the lowest internal-marks percentage needs the most attention.
  const ratio = (s) => (s.internalMax ? s.internal / s.internalMax : 1)
  const weak = subjects.length ? subjects.reduce((a, b) => (ratio(b) < ratio(a) ? b : a)) : null
  const target = scale.find((g) => g.grade === 'B') || scale[Math.min(2, scale.length - 1)]
  let advice = ''
  if (weak) {
    const st = gradeStatus(weak, target)
    advice =
      st.state === 'locked'
        ? `${target.grade} is locked in ${weak.name}. Aim for a lower grade.`
        : st.state === 'secured'
          ? `${weak.name} already has a ${target.grade} secured.`
          : `${weak.name} needs ${st.need} of ${weak.finalMax} in the final for a ${target.grade}.`
  }

  const stats = [
    { label: 'SGPA', value: projected.toFixed(1), note: 'projected', bg: 'bg-[linear-gradient(160deg,#f1e4ff,#fbd3ea)]' },
    { label: 'Credits', value: '2', note: 'time credits', bg: 'bg-[linear-gradient(160deg,#c4f3fb,#93d6f5)]' },
    { label: 'Rank', value: '-', note: 'in challenges', bg: 'border border-line bg-white' },
  ]

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-[28px] font-medium tracking-tight">Hi {first}</h1>
          <p className="m-0 text-[12.5px] text-mute">
            First year, {profile.division}. Everything for today.
          </p>
        </div>
        <Link
          to="/profile"
          aria-label="Profile"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#e9dcff,#a9e4f6)] font-semibold text-ink no-underline"
        >
          {initials}
        </Link>
      </div>

      <div className="my-3.5 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`flex min-h-[108px] flex-col justify-between rounded-3xl p-3.5 ${s.bg}`}>
            <span className="text-xs font-medium">{s.label}</span>
            <b className="text-[28px] font-medium tracking-tight">{s.value}</b>
            <small className="text-[11px] text-mute">{s.note}</small>
          </div>
        ))}
      </div>

      {weak && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-3xl bg-ink px-[18px] py-4 text-white shadow-[0_12px_30px_rgba(22,24,29,0.2)]">
          <div>
            <b>Focus on {weak.name}</b>
            <div className="text-[12.5px] text-[#c3c8d4]">{advice}</div>
          </div>
          <Link
            to="/planner"
            className="flex-none whitespace-nowrap rounded-2xl bg-white px-4 py-[9px] font-medium text-ink no-underline"
          >
            Open planner
          </Link>
        </div>
      )}

      {GROUPS.map((g) => (
        <section key={g}>
          <h2 className="mx-1 mb-2 mt-4 text-[11px] font-medium uppercase tracking-[0.12em] text-mute">{g}</h2>
          <div className="grid grid-cols-2 gap-3">
            {MODULES.filter((m) => m.group === g).map((m, i) => (
              <Link
                key={m.path}
                to={m.path}
                className="relative flex min-h-[108px] flex-col items-start justify-between gap-3.5 rounded-3xl border border-line bg-white p-3.5 text-[13px] text-ink no-underline shadow-[0_10px_28px_rgba(26,42,74,0.06)]"
              >
                <span className={`flex h-[46px] w-[46px] items-center justify-center rounded-[17px] ${ICON_BG[i % 3]}`}>
                  <Icon name={m.icon} />
                </span>
                <span className="font-medium">{m.label}</span>
                {!m.built && <Badge tone="sun">Coming soon</Badge>}
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-line bg-soft text-[13px] text-mute"
                >
                  &#8599;
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
