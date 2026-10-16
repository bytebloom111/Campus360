import { Link } from 'react-router-dom'

const TONES = {
  lilac: 'bg-lilac',
  sun: 'bg-sun',
  mint: 'bg-mint',
  rose: 'bg-rose',
  gray: 'bg-gray-200',
  white: 'bg-white',
}

export function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`mb-3 rounded-3xl border border-line bg-white px-[18px] py-4 shadow-[0_8px_24px_rgba(26,42,74,0.05)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function Badge({ tone = 'gray', children }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-3 py-[3px] text-[11.5px] font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}

export function Button({ solid = false, className = '', ...rest }) {
  const look = solid ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-line'
  return (
    <button
      className={`rounded-2xl border px-4 py-[9px] font-medium transition active:scale-[0.97] disabled:cursor-default disabled:opacity-45 ${look} ${className}`}
      {...rest}
    />
  )
}

export function PageHeader({ title }) {
  return (
    <div className="mb-3 mt-1 flex items-center justify-between gap-3">
      <h1 className="m-0 text-2xl font-medium tracking-tight">{title}</h1>
      <Link
        to="/"
        className="rounded-2xl border border-line bg-white px-4 py-[9px] font-medium text-ink no-underline"
      >
        Home
      </Link>
    </div>
  )
}

export const inputClass =
  'my-1 w-full rounded-2xl border border-transparent bg-soft px-3.5 py-2.5 focus:border-sky-200 focus:bg-white focus:outline-none'
