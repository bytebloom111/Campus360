import { Link } from 'react-router-dom'
import { useApp } from '../context/app-context'
import { MODULES, GROUPS } from '../lib/modules'
import { Card, Badge } from '../components/ui'
import Icon from '../components/Icon'

export default function Home() {
  const { profile } = useApp()
  const first = profile.name.split(' ')[0]

  return (
    <>
      <h1 className="m-0 text-[28px] font-medium tracking-tight">Hi {first}</h1>
      <p className="mb-4 mt-0 text-[12.5px] text-mute">
        First year, {profile.division}. Everything for today.
      </p>
      {GROUPS.map((g) => (
        <section key={g}>
          <h2 className="mb-2 mt-4 text-[13px] font-medium text-mute">{g}</h2>
          <div className="grid grid-cols-2 gap-3">
            {MODULES.filter((m) => m.group === g).map((m) => (
              <Link key={m.path} to={m.path} className="text-ink no-underline">
                <Card className="mb-0 flex h-full flex-col gap-2">
                  <Icon name={m.icon} size={24} />
                  <span className="font-medium">{m.label}</span>
                  {!m.built && <Badge tone="sun">Coming soon</Badge>}
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
