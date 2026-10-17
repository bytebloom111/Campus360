import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/app-context'
import { sendOtp } from '../lib/auth'
import { Card, Button, Badge, inputClass } from '../components/ui'

export default function Login() {
  const { session, login } = useApp()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('phone') // 'phone' then 'otp'
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/" replace />

  async function onSend() {
    setBusy(true)
    setError('')
    try {
      await sendOtp(phone.trim())
      setStep('otp')
    } catch (e) {
      setError(e.message)
    }
    setBusy(false)
  }

  async function onVerify() {
    setBusy(true)
    setError('')
    try {
      await login(phone.trim(), code.trim())
      navigate('/', { replace: true })
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-[480px] px-3.5 pt-10">
      <h1 className="mb-3 text-2xl font-medium tracking-tight">Campus360</h1>
      <Card>
        {step === 'phone' ? (
          <>
            <p className="m-0 text-[12.5px] text-mute">Log in with your phone number</p>
            <input
              className={inputClass}
              inputMode="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-label="Mobile number"
            />
            {error && <Badge tone="rose">{error}</Badge>}
            <div className="mt-2">
              <Button solid disabled={busy} onClick={onSend}>
                {busy ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="m-0 text-[12.5px] text-mute">
              Enter the OTP sent to {phone}.
            </p>
            <input
              className={inputClass}
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-label="One-time password"
            />
            {error && <Badge tone="rose">{error}</Badge>}
            <div className="mt-2 flex items-center justify-between gap-2">
              <Button
                onClick={() => {
                  setStep('phone')
                  setError('')
                }}
              >
                Change number
              </Button>
              <Button solid disabled={busy} onClick={onVerify}>
                {busy ? 'Checking...' : 'Verify and log in'}
              </Button>
            </div>
          </>
        )}
      </Card>
      <p className="text-[12.5px] text-mute">
        Demo mode: login is simulated. MiniMoth phone OTP connects in a later batch.
      </p>
    </main>
  )
}
