import { useLocalStorage } from './storage'
import { seedDeadlines } from './deadlines'

export const useDeadlines = (phone) => useLocalStorage(`c360.deadlines.${phone}`, seedDeadlines())
