import CampusMap from '../components/CampusMap'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Vite does not find Leaflet's default pin images by itself, so we point to them.
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

// EDIT HERE: add or change places. Coordinates are from your college-map.html.
export const PLACES = [
  { name: 'Main Gate', lat: 19.04590895863865, lng: 72.88929075876966, info: 'Main entrance of the college' },
  { name: 'IT Lab', lat: 19.045263531150997, lng: 72.88897351777064, info: 'Open 9 AM to 4 PM' },
  { name: 'Boys Hostel', lat: 19.045816270740424, lng: 72.89044414081108, info: 'Boys hostel' },
  { name: 'Girls Hostel', lat: 19.045922122797, lng: 72.89065871753691, info: 'Girls hostel' },
  { name: 'Playground', lat: 19.045085053498664, lng: 72.88915872573538, info: 'Sports ground' },
]

// Use <CampusMap /> anywhere. Pass selected="IT Lab" to open that place,
// for example from a "Show on map" button.
export default function CampusMap({ selected, height = '60vh' }) {
  const el = useRef(null)
  const mapRef = useRef(null)
  const markers = useRef({})

  function show(name) {
    const p = PLACES.find((x) => x.name === name)
    if (!p || !mapRef.current) return
    mapRef.current.flyTo([p.lat, p.lng], 18)
    markers.current[name]?.openPopup()
  }

  useEffect(() => {
    const map = L.map(el.current)
    mapRef.current = map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    PLACES.forEach((p) => {
      markers.current[p.name] = L.marker([p.lat, p.lng])
        .addTo(map)
        .bindPopup(`<b>${p.name}</b><br>${p.info}`)
    })
    map.fitBounds(PLACES.map((p) => [p.lat, p.lng]), { padding: [40, 40] })
    return () => {
      map.remove()
      mapRef.current = null
      markers.current = {}
    }
  }, [])

  useEffect(() => {
    if (selected) show(selected)
  }, [selected])

  return (
    <div>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {PLACES.map((p) => (
          <button
            key={p.name}
            onClick={() => show(p.name)}
            className="flex-none whitespace-nowrap rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium"
          >
            {p.name}
          </button>
        ))}
      </div>
      {/* isolate + z-0 keep the map underneath your bottom navigation bar */}
      <div ref={el} style={{ height }} className="relative isolate z-0 overflow-hidden rounded-3xl" />
    </div>
  )
}
