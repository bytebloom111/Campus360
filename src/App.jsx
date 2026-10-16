import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Setup from './pages/Setup'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Planner from './pages/Planner'
import Calendar from './pages/Calendar'
import ComingSoon from './pages/ComingSoon'
import { MODULES } from './lib/modules'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/setup" element={<Setup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/calendar" element={<Calendar />} />
          {MODULES.filter((m) => !m.built).map((m) => (
            <Route key={m.path} path={m.path} element={<ComingSoon title={m.label} />} />
          ))}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
