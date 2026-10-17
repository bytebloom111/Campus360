import { useState } from 'react';

export default function OtpTest() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'code'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('code');
        setMessage('OTP sent. Enter the code.');
      } else {
        setMessage(data.error || data.message || 'Could not send OTP');
      }
    } catch {
      setMessage('Network error');
    }
    setLoading(false);
  }

  async function verifyOtp() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Verified ✅');
        console.log('MiniMoth response:', data);
      } else {
        setMessage(data.error || data.message || 'Wrong code');
      }
    } catch {
      setMessage('Network error');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 320, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h3>OTP test</h3>
      {step === 'phone' ? (
        <>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+919876543210"
            style={{ width: '100%', padding: 8 }}
          />
          <button onClick={sendOtp} disabled={loading} style={{ marginTop: 8 }}>
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code (test: 000000)"
            style={{ width: '100%', padding: 8 }}
          />
          <button onClick={verifyOtp} disabled={loading} style={{ marginTop: 8 }}>
            Verify
          </button>
        </>
      )}
      <p>{message}</p>
    </div>
  );
}