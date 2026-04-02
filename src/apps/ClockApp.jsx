import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { 
  RiMoonLine,
  RiSunLine,
  RiTimerLine,
  RiAlarmWarningLine,
  RiDeleteBinLine
} from '@remixicon/react'

const TIME_ZONES = [
  { city:'New York', offset:-4 },
  { city:'London', offset:1 },
  { city:'Paris', offset:2 },
  { city:'Tokyo', offset:9 },
  { city:'Sydney', offset:10 },
  { city:'Dubai', offset:4 },
  { city:'São Paulo', offset:-3 },
]

const TABS = ['worldClock', 'stopwatch', 'timer', 'alarm']

function WorldClock({ now, period }) {
  const { t } = useTranslation()
  const pad = n => String(n).padStart(2, '0')
  const deg = { h: (now.getHours() % 12) * 30 + now.getMinutes() * 0.5, m: now.getMinutes() * 6, s: now.getSeconds() * 6 }
  const hand = (deg, r) => { const rad = deg * Math.PI / 180; return { x: 90 + r * Math.sin(rad), y: 90 - r * Math.cos(rad) } }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24, padding:20, width:'100%' }}>
      <svg viewBox="0 0 180 180" style={{ width:180, height:180 }}>
        <circle cx="90" cy="90" r="88" fill="none" stroke="var(--border)" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = i * 30 * Math.PI / 180, r1 = i % 3 === 0 ? 72 : 76
          return <line key={i} x1={90 + r1 * Math.sin(a)} y1={90 - r1 * Math.cos(a)} x2={90 + 80 * Math.sin(a)} y2={90 - 80 * Math.cos(a)} stroke={i % 3 === 0 ? 'var(--text-sec)' : 'var(--border)'} strokeWidth={i % 3 === 0 ? 2 : 1} />
        })}
        <line x1="90" y1="90" x2={hand(deg.h, 48).x} y2={hand(deg.h, 48).y} stroke="var(--text-pri)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="90" y1="90" x2={hand(deg.m, 64).x} y2={hand(deg.m, 64).y} stroke="var(--text-pri)" strokeWidth="2"   strokeLinecap="round" />
        <line x1="90" y1="90" x2={hand(deg.s, 70).x} y2={hand(deg.s, 70).y} stroke={period.accent} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="90" cy="90" r="4" fill={period.accent} />
      </svg>

      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'Syne', fontSize:56, fontWeight:300, color:'var(--text-pri)', letterSpacing:-2, lineHeight:1 }}>
          {pad(now.getHours())}:{pad(now.getMinutes())}
          <span style={{ fontSize:28, color:period.accent }}>:{pad(now.getSeconds())}</span>
        </div>
        <div style={{ fontSize:14, color:'var(--text-ter)', marginTop:6, fontWeight:300 }}>
          {now.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' })}
        </div>
      </div>

      <div style={{ width:'100%', marginTop:12 }}>
        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, color:'var(--text-ter)', textTransform:'uppercase', marginBottom:12 }}>
          {t('clock.worldClock')}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:10 }}>
          {TIME_ZONES.map(tz => {
            const localTime = new Date(now.getTime() + tz.offset * 60 * 60 * 1000)
            const hours = localTime.getUTCHours()
            const isNight = hours < 6 || hours >= 18
            return (
              <div key={tz.city} style={{
                padding:'12px', borderRadius:10, background:'var(--surface)',
                border:`1px solid ${isNight ? period.accentDim || 'rgba(96,165,250,0.2)' : 'var(--border)'}`,
              }}>
                <div style={{ fontSize:11, color:'var(--text-ter)', marginBottom:4 }}>{tz.city}</div>
                <div style={{ fontFamily:'DM Mono', fontSize:18, color:'var(--text-pri)' }}>
                  {pad(hours)}:{pad(localTime.getUTCMinutes())}
                </div>
                 <div style={{ fontSize:10, color:isNight ? period.accent : 'var(--text-ter)', marginTop:2, display:'flex', alignItems:'center', gap:4 }}>
                   {isNight ? <RiMoonLine size={12} color={period.accent} /> : <RiSunLine size={12} color="var(--text-ter)" />}
                   {tz.offset > 0 ? `+${tz.offset}` : tz.offset}h
                 </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Stopwatch() {
  const { t } = useTranslation()
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTime(v => v + 10), 10)
      return () => clearInterval(intervalRef.current)
    }
  }, [running])

  const formatTime = ms => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    return `${String(h % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.${String(Math.floor((ms % 1000) / 10)).padStart(2, '0')}`
  }

  const handleStart = () => {
    setRunning(!running)
  }

  const handleReset = () => {
    setRunning(false)
    setTime(0)
    setLaps([])
  }

  const handleLap = () => {
    if (running && time > 0) {
      setLaps(prev => [{ number: prev.length + 1, time }, ...prev])
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:24, padding:20, width:'100%' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'DM Mono', fontSize:48, fontWeight:300, color:'var(--text-pri)', letterSpacing:-1, lineHeight:1 }}>
          {formatTime(time)}
        </div>
      </div>

      <div style={{ display:'flex', gap:12 }}>
        <button onClick={handleReset} disabled={time === 0} style={{
          padding:'14px 24px', borderRadius:10, border:'none', cursor:'pointer',
          fontFamily:'Syne', fontSize:14, fontWeight:600,
          background:'var(--surface-hover)', color:'var(--text-sec)',
          opacity: time === 0 ? 0.5 : 1,
          transition:'all .15s',
        }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-hover)'}>
          {t('clock.reset')}
        </button>
        <button onClick={handleStart} style={{
          padding:'14px 32px', borderRadius:10, border:'none', cursor:'pointer',
          fontFamily:'Syne', fontSize:14, fontWeight:600,
          background:'var(--accent)', color:'#fff',
          transition:'all .15s',
        }} onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          {running ? t('clock.pause') : t('clock.start')}
        </button>
        <button onClick={handleLap} disabled={!running || time === 0} style={{
          padding:'14px 24px', borderRadius:10, border:'none', cursor:'pointer',
          fontFamily:'Syne', fontSize:14, fontWeight:600,
          background:'var(--surface-hover)', color:'var(--text-sec)',
          opacity: !running || time === 0 ? 0.5 : 1,
          transition:'all .15s',
        }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-hover)'}>
          {t('clock.lap')}
        </button>
      </div>

      {laps.length > 0 && (
        <div style={{ width:'100%', maxWidth:400, maxHeight:200, overflow:'auto' }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, color:'var(--text-ter)', textTransform:'uppercase', marginBottom:8 }}>
            {t('clock.laps')}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {laps.map(lap => (
              <div key={lap.number} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'8px 12px', borderRadius:8, background:'var(--surface)',
              }}>
                <span style={{ fontSize:12, color:'var(--text-sec)' }}>#{lap.number}</span>
                <span style={{ fontFamily:'DM Mono', fontSize:14, color:'var(--text-pri)' }}>{formatTime(lap.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Timer() {
  const { t } = useTranslation()
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [input, setInput] = useState({ h:0, m:5, s:0 })
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(v => {
          if (v <= 1000) {
            setRunning(false)
            setFinished(true)
            return 0
          }
          return v - 1000
        })
      }, 1000)
      return () => clearInterval(intervalRef.current)
    }
  }, [running, time])

  const formatTime = ms => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    return `${String(h % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  const handleStart = () => {
    if (time === 0 && !finished) {
      const totalMs = (input.h * 3600 + input.m * 60 + input.s) * 1000
      if (totalMs > 0) {
        setTime(totalMs)
        setRunning(true)
      }
    } else if (running) {
      setRunning(false)
    } else if (time > 0) {
      setRunning(true)
    }
  }

  const handleReset = () => {
    setRunning(false)
    setTime(0)
    setFinished(false)
    setInput({ h:0, m:5, s:0 })
  }

  if (finished) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:24, padding:20 }}>
        <RiTimerLine size={64} color="var(--accent)" />
        <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, color:'var(--accent)', textAlign:'center' }}>
          {t('clock.timeUp')}
        </div>
        <button onClick={handleReset} style={{
          padding:'14px 32px', borderRadius:10, border:'none', cursor:'pointer',
          fontFamily:'var(--font-display)', fontSize:14, fontWeight:600,
          background:'var(--accent)', color:'#fff',
          transition:'all .15s',
        }} onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          {t('clock.reset')}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:24, padding:20, width:'100%' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'DM Mono', fontSize:56, fontWeight:300, color:'var(--text-pri)', letterSpacing:-2, lineHeight:1 }}>
          {formatTime(time || (input.h * 3600 + input.m * 60 + input.s) * 1000)}
        </div>
      </div>

      {!running && time === 0 && (
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={{ fontSize:10, color:'var(--text-ter)' }}>{t('clock.hours')}</label>
            <input type="number" min="0" max="23" value={input.h} onChange={e => setInput({...input, h: Math.max(0, Math.min(23, parseInt(e.target.value) || 0))})} style={{
              width:60, padding:'8px', borderRadius:8, border:'1px solid var(--border)',
              background:'var(--surface)', color:'var(--text-pri)', fontFamily:'DM Mono', fontSize:18,
              textAlign:'center',
            }} />
          </div>
          <span style={{ fontSize:24, color:'var(--text-ter)', marginTop:16 }}>:</span>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={{ fontSize:10, color:'var(--text-ter)' }}>{t('clock.minutes')}</label>
            <input type="number" min="0" max="59" value={input.m} onChange={e => setInput({...input, m: Math.max(0, Math.min(59, parseInt(e.target.value) || 0))})} style={{
              width:60, padding:'8px', borderRadius:8, border:'1px solid var(--border)',
              background:'var(--surface)', color:'var(--text-pri)', fontFamily:'DM Mono', fontSize:18,
              textAlign:'center',
            }} />
          </div>
          <span style={{ fontSize:24, color:'var(--text-ter)', marginTop:16 }}>:</span>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={{ fontSize:10, color:'var(--text-ter)' }}>{t('clock.seconds')}</label>
            <input type="number" min="0" max="59" value={input.s} onChange={e => setInput({...input, s: Math.max(0, Math.min(59, parseInt(e.target.value) || 0))})} style={{
              width:60, padding:'8px', borderRadius:8, border:'1px solid var(--border)',
              background:'var(--surface)', color:'var(--text-pri)', fontFamily:'DM Mono', fontSize:18,
              textAlign:'center',
            }} />
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:12 }}>
        <button onClick={handleReset} style={{
          padding:'14px 24px', borderRadius:10, border:'none', cursor:'pointer',
          fontFamily:'Syne', fontSize:14, fontWeight:600,
          background:'var(--surface-hover)', color:'var(--text-sec)',
          transition:'all .15s',
        }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-hover)'}>
          {t('clock.reset')}
        </button>
        <button onClick={handleStart} style={{
          padding:'14px 32px', borderRadius:10, border:'none', cursor:'pointer',
          fontFamily:'Syne', fontSize:14, fontWeight:600,
          background:'var(--accent)', color:'#fff',
          transition:'all .15s',
        }} onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          {running ? t('clock.pause') : t('clock.start')}
        </button>
      </div>
    </div>
  )
}

const SectionLabel = ({ children }) => (
  <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.8, color:'var(--text-ter)', textTransform:'uppercase', padding:'20px 0 10px' }}>
    {children}
  </div>
)

const Divider = () => <div style={{ height:'0.5px', background:'var(--border)', margin:'3px 0' }} />

function Alarm() {
  const { t } = useTranslation()
  const [alarms, setAlarms] = useState([])
  const [newAlarm, setNewAlarm] = useState({ h:7, m:0, label:'' })
  const [editingId, setEditingId] = useState(null)
  const [soundingAlarm, setSoundingAlarm] = useState(null)
  const [now, setNow] = useState(new Date())
  const audioRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => {
      const current = new Date()
      setNow(current)
      
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.h === current.getHours() && alarm.m === current.getMinutes() && current.getSeconds() === 0) {
          setSoundingAlarm(alarm.id)
        }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [alarms])

  const handleAddAlarm = () => {
    if (newAlarm.h !== '' && newAlarm.m !== '') {
      setAlarms(prev => [...prev, {
        id: Date.now(),
        h: parseInt(newAlarm.h),
        m: parseInt(newAlarm.m),
        label: newAlarm.label,
        enabled: true
      }])
      setNewAlarm({ h:7, m:0, label:'' })
    }
  }

  const handleToggleAlarm = (id) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
  }

  const handleDeleteAlarm = (id) => {
    setAlarms(prev => prev.filter(a => a.id !== id))
    if (soundingAlarm === id) {
      setSoundingAlarm(null)
    }
  }

  const handleStopAlarm = () => {
    setSoundingAlarm(null)
  }

  const pad = n => String(n).padStart(2, '0')

  return (
    <div style={{ height:'100%', overflowY:'auto', padding:'4px 24px 48px', scrollbarWidth:'thin' }}>
      {soundingAlarm && (
        <div style={{
          position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:1000,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          background:'rgba(0,0,0,0.85)',
        }} onClick={handleStopAlarm}>
          <RiAlarmWarningLine size={64} color="var(--accent)" style={{ animation:'shake 0.5s infinite' }} />
          <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, color:'var(--accent)', marginTop:20 }}>
            {t('clock.alarmSounding')}
          </div>
          <button onClick={handleStopAlarm} style={{
            marginTop:20, padding:'14px 32px', borderRadius:8, border:'none',
            fontFamily:'var(--font-display)', fontSize:14, fontWeight:600,
            background:'var(--accent)', color:'#fff',
            transition:'all .15s',
          }} onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
            {t('clock.stop')}
          </button>
        </div>
      )}

      <SectionLabel>{t('clock.addAlarm')}</SectionLabel>
      
      <div style={{
        padding:'14px', borderRadius:12, background:'var(--surface)',
        border:'1px solid var(--border)', marginBottom:4,
      }}>
        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10 }}>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:10, color:'var(--text-ter)', display:'block', marginBottom:4, fontWeight:500 }}>
              {t('clock.hours')}
            </label>
            <input 
              type="number" 
              min="0" 
              max="23" 
              value={newAlarm.h} 
              onChange={e => setNewAlarm({...newAlarm, h: Math.max(0, Math.min(23, parseInt(e.target.value) || 0))})} 
              style={{
                width:'100%', padding:'8px 10px', borderRadius:8, border:'1px solid var(--border)',
                background:'var(--surface-hover)', color:'var(--text-pri)', fontFamily:'var(--font-mono)', fontSize:18,
                transition:'all .15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>
          
          <span style={{ fontSize:24, color:'var(--text-ter)', marginTop:18 }}>:</span>
          
          <div style={{ flex:1 }}>
            <label style={{ fontSize:10, color:'var(--text-ter)', display:'block', marginBottom:4, fontWeight:500 }}>
              {t('clock.minutes')}
            </label>
            <input 
              type="number" 
              min="0" 
              max="59" 
              value={newAlarm.m} 
              onChange={e => setNewAlarm({...newAlarm, m: Math.max(0, Math.min(59, parseInt(e.target.value) || 0))})} 
              style={{
                width:'100%', padding:'8px 10px', borderRadius:8, border:'1px solid var(--border)',
                background:'var(--surface-hover)', color:'var(--text-pri)', fontFamily:'var(--font-mono)', fontSize:18,
                transition:'all .15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
        
        <div style={{ marginBottom:10 }}>
          <label style={{ fontSize:10, color:'var(--text-ter)', display:'block', marginBottom:4, fontWeight:500 }}>
            {t('clock.alarmName')}
          </label>
          <input 
            type="text" 
            placeholder={t('clock.alarmName')} 
            value={newAlarm.label} 
            onChange={e => setNewAlarm({...newAlarm, label: e.target.value})} 
            style={{
              width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid var(--border)',
              background:'var(--surface-hover)', color:'var(--text-pri)', fontFamily:'var(--font-body)', fontSize:13,
              transition:'all .15s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
          />
        </div>

        <button 
          onClick={handleAddAlarm} 
          style={{
            width:'100%', padding:'10px 20px', borderRadius:8, border:'none', cursor:'pointer',
            fontFamily:'var(--font-body)', fontSize:13, fontWeight:600,
            background:'var(--accent)', color:'#fff',
            transition:'all .15s',
          }} 
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9} 
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          {t('clock.addAlarm')}
        </button>
      </div>

      <Divider />

      <SectionLabel>{alarms.length === 0 ? t('clock.noAlarms') : `${alarms.length} ${t('clock.alarm')}${alarms.length > 1 ? 's' : ''}`}</SectionLabel>
      
      {alarms.length === 0 ? (
        <div style={{
          padding:'40px 20px', borderRadius:12, background:'var(--surface)',
          border:'1px solid var(--border)', textAlign:'center',
        }}>
          <RiAlarmWarningLine size={48} color="var(--text-ter)" style={{ marginBottom:12 }} />
          <div style={{ fontSize:13, color:'var(--text-sec)', fontFamily:'var(--font-body)' }}>
            {t('clock.noAlarms')}
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {alarms.map(alarm => (
            <div key={alarm.id} style={{
              display:'flex', alignItems:'center', gap:12, padding:'13px 14px',
              borderRadius:10, background:'var(--surface)', border:`1px solid ${alarm.enabled ? 'rgba(96,165,250,0.25)' : 'var(--border)'}`,
              transition:'all .15s',
            }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
              <button 
                onClick={() => handleToggleAlarm(alarm.id)} 
                style={{
                  width:38, height:20, borderRadius:10, border:'none', cursor:'pointer',
                  background: alarm.enabled ? 'var(--accent)' : 'var(--border)',
                  position:'relative', transition:'background .2s', flexShrink:0,
                }}
              >
                <div style={{
                  width:16, height:16, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:2,
                  left: alarm.enabled ? 20 : 2,
                  transition:'left .2s',
                }} />
              </button>
              
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ 
                  fontFamily:'var(--font-mono)', fontSize:20, color:'var(--text-pri)', fontWeight:500,
                  marginBottom:2,
                }}>
                  {pad(alarm.h)}:{pad(alarm.m)}
                </div>
                {alarm.label && (
                  <div style={{ fontSize:12, color:'var(--text-ter)', fontFamily:'var(--font-body)', fontWeight:400 }}>
                    {alarm.label}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handleDeleteAlarm(alarm.id)} 
                style={{
                  padding:'6px 12px', borderRadius:8, border:'1px solid var(--border)', cursor:'pointer',
                  background:'transparent', color:'var(--text-sec)', fontSize:12, fontWeight:500,
                  fontFamily:'var(--font-body)', flexShrink:0, transition:'all .15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--surface-hover)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--text-sec)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-sec)'
                }}
              >
                {t('clock.delete')}
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  )
}

export default function ClockApp() {
  const { t } = useTranslation()
  const { period } = useTheme()
  const [activeTab, setActiveTab] = useState('worldClock')
  const [now, setNow] = useState(new Date())

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ display:'flex', gap:8, padding:'12px 16px', borderBottom:'1px solid var(--border)', background:'var(--surface)' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex:1,
              padding:'8px 12px',
              borderRadius:8,
              border:'none',
              cursor:'pointer',
              fontFamily:'Syne',
              fontSize:13,
              fontWeight:600,
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-sec)',
              transition:'all .15s',
            }}
            onMouseEnter={e => { if(activeTab !== tab) e.currentTarget.style.background = 'var(--surface-hover)' }}
            onMouseLeave={e => { if(activeTab !== tab) e.currentTarget.style.background = 'transparent' }}
          >
            {t(`clock.${tab}`)}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflow:'auto', position:'relative' }}>
        {activeTab === 'worldClock' && <WorldClock now={now} period={period} />}
        {activeTab === 'stopwatch' && <Stopwatch />}
        {activeTab === 'timer' && <Timer />}
        {activeTab === 'alarm' && <Alarm />}
      </div>
    </div>
  )
}
