// MOCK login. Every function here has the same name and shape the real
// MiniMoth version will have, so only this file changes later.
import { load, save } from './storage'

const KEY = 'c360.session'
const ACCESS_MS = 15 * 60 * 1000 // access token lasts 15 minutes
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000 // refresh token lasts 7 days
const DEMO_OTP = '1234'

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms))
const token = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export async function sendOtp(phone) {
  await wait()
  if (!/^\d{10}$/.test(phone)) throw new Error('Enter a 10-digit mobile number')
  return { ok: true }
}

export async function verifyOtp(phone, code) {
  await wait()
  if (code !== DEMO_OTP) throw new Error('Wrong OTP. Use 1234 in the demo')
  const now = Date.now()
  const session = {
    phone,
    accessToken: token(),
    refreshToken: token(),
    accessExp: now + ACCESS_MS,
    refreshExp: now + REFRESH_MS,
  }
  save(KEY, session)
  return session
}

export function getSession() {
  return load(KEY, null)
}

// Quietly get a new access token using the refresh token.
export async function refreshSession() {
  const s = getSession()
  if (!s || Date.now() > s.refreshExp) return null
  const next = { ...s, accessToken: token(), accessExp: Date.now() + ACCESS_MS }
  save(KEY, next)
  return next
}

// 1) access token valid -> continue. 2) expired -> refresh silently.
// 3) refresh fails too -> log out (the app sends the user to Login).
export async function validateSession() {
  const s = getSession()
  if (!s) return null
  if (Date.now() < s.accessExp) return s
  const refreshed = await refreshSession()
  if (!refreshed) logout()
  return refreshed
}

export function logout() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
