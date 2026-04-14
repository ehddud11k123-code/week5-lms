import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useProgress() {
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_URL}/api/progress/`)
      .then(res => {
        const map = {}
        res.data.forEach(p => { map[p.section_id] = p.completed })
        setProgress(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleSection = async (sectionId, completed) => {
    await axios.post(`${API_URL}/api/progress/`, { section_id: sectionId, completed })
    setProgress(prev => ({ ...prev, [sectionId]: completed }))
  }

  const completedCount = Object.values(progress).filter(Boolean).length

  return { progress, loading, toggleSection, completedCount }
}
