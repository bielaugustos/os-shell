import { useEffect, useState } from 'react'
import { getPeriod, applyTheme } from '../config/theme'

export function useTheme(currentTime) {
  const [period,   setPeriod]   = useState(() => getPeriod(currentTime?.getHours()))
  const [override, setOverride] = useState(null)
  const active = override ?? period

  useEffect(() => { applyTheme(active) }, [active])

  useEffect(() => {
    const hour = currentTime?.getHours()
    const next = getPeriod(hour)
    setPeriod(prev => prev.name !== next.name ? next : prev)
  }, [currentTime])

  return { period: active, setOverride, clearOverride: () => setOverride(null) }
}
