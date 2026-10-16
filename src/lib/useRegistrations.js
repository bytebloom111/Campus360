import { useLocalStorage } from './storage'

export function useRegistrations(phone) {
  const [reg, setReg] = useLocalStorage(`c360.events.${phone}`, [])
  const toggle = (id) => setReg((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]))
  return [reg, toggle]
}
