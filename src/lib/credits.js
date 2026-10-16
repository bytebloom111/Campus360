import { useLocalStorage } from './storage'

// Peer learning time credits: 1 credit = 1 hour. Everyone starts with 2.
export const START_CREDITS = 2

export function usePeer(phone) {
  const [st, setSt] = useLocalStorage(`c360.peer.${phone}`, {
    credits: START_CREDITS, booked: [], offers: [], wants: [], helping: [],
  })
  return [st, setSt]
}
