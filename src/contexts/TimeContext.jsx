import React, { createContext, useContext, useEffect, useState } from 'react'

const TimeContext = createContext(null)

export function useTime() {
  const context = useContext(TimeContext)
  if (!context) {
    throw new Error('useTime must be used within TimeProvider')
  }
  return context
}

export function TimeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('timeMode')
    return saved || 'online'
  })
  const [manualTime, setManualTime] = useState(() => {
    const saved = localStorage.getItem('manualTime')
    return saved ? new Date(saved) : new Date()
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    if (mode === 'online') {
      const id = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
      return () => clearInterval(id)
    }
  }, [mode])

  useEffect(() => {
    if (mode === 'offline') {
      const id = setInterval(() => {
        setManualTime(prev => {
          const updated = new Date(prev.getTime() + 1000)
          localStorage.setItem('manualTime', updated.toISOString())
          setCurrentTime(updated)
          return updated
        })
      }, 1000)
      return () => clearInterval(id)
    }
  }, [mode])

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const setModeWithSave = (newMode) => {
    setMode(newMode)
    localStorage.setItem('timeMode', newMode)
  }

  const setManualTimeWithSave = (newTime) => {
    setManualTime(newTime)
    setCurrentTime(newTime)
    localStorage.setItem('manualTime', newTime.toISOString())
  }

  const syncTime = async () => {
    try {
      const response = await fetch('http://worldtimeapi.org/api/timezone/America/Sao_Paulo')
      if (response.ok) {
        const data = await response.json()
        const syncedTime = new Date(data.datetime)
        setCurrentTime(syncedTime)
        if (mode === 'offline') {
          setManualTimeWithSave(syncedTime)
        }
        return syncedTime
      }
    } catch (error) {
      console.error('Failed to sync time:', error)
      return null
    }
  }

  return (
    <TimeContext.Provider value={{ mode, setMode: setModeWithSave, manualTime, setManualTime: setManualTimeWithSave, currentTime, online, syncTime }}>
      {children}
    </TimeContext.Provider>
  )
}
