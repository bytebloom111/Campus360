import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <>
      <main className="mx-auto max-w-[480px] px-3.5 pb-28 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}
