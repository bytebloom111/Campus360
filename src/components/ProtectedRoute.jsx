import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/app-context'
import { validateSession } from '../lib/auth'

// Wraps every page except Login. No valid session means no access.
export default function ProtectedRoute() {
  const { session, setSession, profile } = useApp()
  const { pathname } = useLocation()
  const [checking, setChecking] = useState(true)

  // Runs when the app opens and every time the student opens a new page.
  useEffect(() => {
    let alive = true
    validateSession().then((s) => {
      if (alive) {
        setSession(s)
        setChecking(false)
      }
    })
    return () => {
      alive = false
    }
  }, [pathname, setSession])

  if (checking) return <p className="p-6 text-mute">Checking your login...</p>
  if (!session) return <Navigate to="/login" replace />
  if (!profile && pathname !== '/setup') return <Navigate to="/setup" replace />
  return <Outlet />
}
