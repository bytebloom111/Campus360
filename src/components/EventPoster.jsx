import { eventState, matches, STATE } from '../lib/events'

// One event card: colour-coded state badge, "For you" tag, register button.
export default function EventPoster({ e, now, interests, registered, onToggle }) {
  const state = eventState(e, now)
  const st = STATE[state]
  const forYou = state !== 'ended' && matches(e, interests) > 0
  return (
    <div
      className="flex min-h-[140px] flex-none basis-[78%] flex-col justify-end gap-1 rounded-3xl p-4 text-ink"
      style={{ background: `linear-gradient(135deg,${e.g})` }}
    >
      <div className="flex flex-wrap gap-1.5 self-start">
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-[3px] text-[11.5px] font-medium">
          <i className={`h-2 w-2 rounded-full ${st.dot}`} />
          {st.label}
        </span>
        {forYou && (
          <span className="rounded-full bg-white px-3 py-[3px] text-[11.5px] font-medium">For you</span>
        )}
      </div>
      <b className="text-[21px] font-medium leading-tight">{e.title}</b>
      <span className="text-[12.5px]">{e.venue}</span>
      {state === 'open' && (
        <button
          onClick={onToggle}
          className={`mt-1 self-start rounded-2xl border border-ink px-4 py-[9px] font-medium transition active:scale-[0.97] ${
            registered ? 'bg-white text-ink' : 'bg-ink text-white'
          }`}
        >
          {registered ? 'Registered' : 'Register'}
        </button>
      )}
    </div>
  )
}
