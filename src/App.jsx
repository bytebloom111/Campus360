import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Setup from './pages/Setup'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Planner from './pages/Planner'
import Calendar from './pages/Calendar'
import Focus from './pages/Focus'
import Library from './pages/Library'
import Pyq from './pages/Pyq'
import Contacts from './pages/Contacts'
import Rides from './pages/Rides'
import Challenges from './pages/Challenges'
import Peer from './pages/Peer'
import OtpTest from './OtpTest'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
      <Route path="/otp-test" element={<OtpTest />} />
        <Route path="/setup" element={<Setup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/library" element={<Library />} />
          <Route path="/pyq" element={<Pyq />} />
          <Route path="/map" element={<Contacts />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/peer" element={<Peer />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
