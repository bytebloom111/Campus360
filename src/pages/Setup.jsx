import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/app-context'
import { DIVISIONS, INTERESTS } from '../lib/campus'
import { Card, Button, inputClass } from '../components/ui'

// Shown once, right after a student's first login.
export default function Setup() {
  const { saveProfile, profile } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState(profile?.name || '')
  const [division, setDivision] = useState(profile?.division || DIVISIONS[0].d)
  const [interests, setInterests] = useState(profile?.interests || [])

  const toggle = (a) =>
    setInterests((list) => (list.includes(a) ? list.filter((x) => x !== a) : [...list, a]))

  function onSave() {
    const branch = DIVISIONS.find((x) => x.d === division).b
    saveProfile({ name: name.trim(), division, branch, interests })
    navigate('/', { replace: true })
  }

  return (
    <main className="mx-auto max-w-[480px] px-3.5 pb-10 pt-10">
      <h1 className="mb-1 text-2xl font-medium tracking-tight">Set up your profile</h1>
      <p className="mb-3 text-[12.5px] text-mute">
        We use this to suggest events and show your division on the leaderboard.
      </p>
      <Card>
        <label className="text-[12.5px] text-mute" htmlFor="nm">
          Your name
        </label>
        <input
          id="nm"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Aarav Mehta"
        />
        <label className="text-[12.5px] text-mute" htmlFor="dv">
          Division
        </label>
        <select
          id="dv"
          className={inputClass}
          value={division}
          onChange={(e) => setDivision(e.target.value)}
        >
          {DIVISIONS.map((x) => (
            <option key={x.d} value={x.d}>
              {x.d} ({x.b})
            </option>
          ))}
        </select>
      </Card>
      <Card>
        <h3 className="m-0 mb-1 text-[15px] font-semibold">Interests</h3>
        <p className="m-0 mb-2 text-[12.5px] text-mute">Tap to select.</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((a) => (
            <Button key={a} solid={interests.includes(a)} onClick={() => toggle(a)}>
              {a}
            </Button>
          ))}
        </div>
      </Card>
      <Button solid disabled={!name.trim()} onClick={onSave}>
        Save and continue
      </Button>
    </main>
  )
}
