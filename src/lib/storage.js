import { useState, useEffect } from 'react'

// Read a saved value from the browser. Returns `fallback` if nothing is saved.
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Save a value in the browser.
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or blocked: the app still works, it just won't remember
  }
}

// Works like useState, but the value also survives a page refresh.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => load(key, initial))
  useEffect(() => {
    save(key, value)
  }, [key, value])
  return [value, setValue]
}
