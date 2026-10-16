import { useState, useCallback } from 'react'
import { AppContext } from './app-context'
import * as auth from '../lib/auth'
import { useLocalStorage } from '../lib/storage'

// Holds the logged-in session and the student's profile for the whole app.
export default function AppProvider({ children }) {
  const [session, setSession] = useState(() => auth.getSession())
  const [profiles, setProfiles] = useLocalStorage('c360.profiles', {})
  const phone = session?.phone
  const profile = phone ? profiles[phone] || null : null

  const login = useCallback(async (phoneNo, code) => {
    const s = await auth.verifyOtp(phoneNo, code)
    setSession(s)
    return s
  }, [])

  const logout = useCallback(() => {
    auth.logout()
    setSession(null)
  }, [])

  const saveProfile = useCallback(
    (data) => {
      setProfiles((all) => ({ ...all, [phone]: { ...(all[phone] || {}), ...data } }))
    },
    [phone, setProfiles],
  )

  return (
    <AppContext.Provider value={{ session, setSession, profile, login, logout, saveProfile }}>
      {children}
    </AppContext.Provider>
  )
}
