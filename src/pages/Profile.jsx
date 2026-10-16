import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/app-context'
import { INTERESTS } from '../lib/campus'
import { Card, Button } from '../components/ui'

export default function Profile() {
  const { profile, session, saveProfile, logout } = useApp()
  const navigate = useNavigate()
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const toggle = (a) =>
    saveProfile({
      interests: profile.interests.includes(a)
        ? profile.interests.filter((x) => x !== a)
        : [...profile.interests, a],
    })

  return (
    <>
      <Card className="text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-lilac text-xl font-medium">
          {initials}
        </div>
        <h1 className="m-0 text-2xl font-medium tracking-tight">{profile.name}</h1>
        <p className="m-0 text-[12.5px] text-mute">
          First year, {profile.branch}, {profile.division}
        </p>
      </Card>
      <Card>
        <div className="flex justify-between">
          <span>Phone</span>
          <b>{session.phone}</b>
        </div>
      </Card>
      <Card>
        <h3 className="m-0 mb-1 text-[15px] font-semibold">Interests</h3>
        <p className="m-0 mb-2 text-[12.5px] text-mute">
          Tap to change. Events are suggested from these.
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((a) => (
            <Button key={a} solid={profile.interests.includes(a)} onClick={() => toggle(a)}>
              {a}
            </Button>
          ))}
        </div>
      </Card>
      <Button
        onClick={() => {
          logout()
          navigate('/login', { replace: true })
        }}
      >
        Log out
      </Button>
    </>
  )
}
