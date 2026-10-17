import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const pin = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export const PLACES = [
  { name: 'Main Gate', lat: 19.04590895863865, lng: 72.88929075876966, info: 'Main entrance of the college' },
  { name: 'IT Lab', lat: 19.045263531150997, lng: 72.88897351777064, info: 'Open 9 AM to 4 PM' },
  { name: 'Boys Hostel', lat: 19.045816270740424, lng: 72.89044414081108, info: 'Boys hostel' },
  { name: 'Girls Hostel', lat: 19.045922122797, lng: 72.89065871753691, info: 'Girls hostel' },
  { name: 'Playground', lat: 19.045085053498664, lng: 72.88915872573538, info: 'Sports ground' },
]

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
      markers.current[p.name] = L.marker([p.lat, p.lng], { icon: pin })
        .addTo(map)
        .bindPopup(`<b>${p.name}</b><br>${p.info}`)
    })
    map.fitBounds(PLACES.map((p) => [p.lat, p.lng]), { padding: [40, 40] })
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(el.current)
    setTimeout(() => map.invalidateSize(), 300)
    return () => {
      ro.disconnect()
      map.remove()
      mapRef.current = null
      markers.current = {}
    }
  }, [])
  return<div ref={el} style={{ height, width: '100%'}} />
}