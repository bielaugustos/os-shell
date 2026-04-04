import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiTimeLine, RiWifiOffLine, RiWifiLine, RiRefreshLine } from '@remixicon/react'
import { useTime } from '../contexts/TimeContext'

export default function TimeSettings({ onThemeOverride }) {
  const { t } = useTranslation()
  const { mode, setMode, manualTime, setManualTime, currentTime, online, syncTime } = useTime()
  const [editing, setEditing] = useState(false)
  const [editTime, setEditTime] = useState('')

  const handleModeChange = (newMode) => {
    if (newMode === 'offline') {
      setEditing(false)
      setMode(newMode)
    } else {
      setMode(newMode)
    }
  }

  const handleManualTimeSubmit = () => {
    const parsed = new Date(editTime)
    if (!isNaN(parsed.getTime())) {
      setManualTime(parsed)
      setEditing(false)
    }
  }

  const handleTimeSync = async () => {
    await syncTime()
  }

  const formatDisplayTime = () => {
    return currentTime.toLocaleTimeString(undefined, { hour12: false })
  }

  const formatDisplayDate = () => {
    const options = { weekday:'long', year:'numeric', month:'long', day:'numeric' }
    return currentTime.toLocaleDateString(undefined, options)
  }

  return (
    <div style={{ padding:'12px 20px' }}>
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, color:'var(--text-ter)', textTransform:'uppercase', marginBottom:12 }}>
        {t('settings.timeSettings', { defaultValue: 'Tempo' })}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <button
          onClick={() => handleModeChange('online')}
          style={{
            flex:1,
            padding:'10px 12px',
            borderRadius:10,
            border: mode === 'online' ? '1px solid var(--accent)' : '1px solid var(--border)',
            background: mode === 'online' ? 'var(--accent-dim)' : 'var(--surface)',
            color: mode === 'online' ? 'var(--accent)' : 'var(--text-sec)',
            fontSize:12,
            cursor:'pointer',
            fontFamily:'inherit',
            fontWeight:500,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:6,
            transition:'all .15s',
          }}
        >
          <RiWifiLine size={14} />
          {t('settings.onlineTime', { defaultValue: 'Online' })}
        </button>
        <button
          onClick={() => handleModeChange('offline')}
          style={{
            flex:1,
            padding:'10px 12px',
            borderRadius:10,
            border: mode === 'offline' ? '1px solid var(--accent)' : '1px solid var(--border)',
            background: mode === 'offline' ? 'var(--accent-dim)' : 'var(--surface)',
            color: mode === 'offline' ? 'var(--accent)' : 'var(--text-sec)',
            fontSize:12,
            cursor:'pointer',
            fontFamily:'inherit',
            fontWeight:500,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:6,
            transition:'all .15s',
          }}
        >
          <RiWifiOffLine size={14} />
          {t('settings.offlineTime', { defaultValue: 'Manual' })}
        </button>
      </div>

      <div style={{ padding:'14px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}>
          <RiTimeLine size={18} style={{ color:'var(--accent)' }} />
          <span style={{ fontSize:28, fontWeight:600, color:'var(--text-pri)', fontFamily:'var(--font-mono)' }}>
            {formatDisplayTime()}
          </span>
        </div>
        <div style={{ fontSize:13, color:'var(--text-sec)', textAlign:'center', fontWeight:300 }}>
          {formatDisplayDate()}
        </div>
        <div style={{ marginTop:12, display:'flex', gap:8, justifyContent:'center' }}>
          {mode === 'offline' && (
            <button
              onClick={() => {
                setEditing(true)
                setEditTime(manualTime.toISOString().slice(0, 16))
              }}
              style={{
                padding:'6px 12px',
                borderRadius:8,
                border:'1px solid var(--border)',
                background:'transparent',
                color:'var(--text-sec)',
                fontSize:11,
                cursor:'pointer',
                fontFamily:'inherit',
                transition:'all .15s',
              }}
            >
              {t('settings.editTime', { defaultValue: 'Editar' })}
            </button>
          )}
          <button
            onClick={handleTimeSync}
            style={{
              padding:'6px 12px',
              borderRadius:8,
              border:'1px solid var(--border)',
              background:'var(--surface)',
              color:'var(--text-sec)',
              fontSize:11,
              cursor:'pointer',
              fontFamily:'inherit',
              display:'flex',
              alignItems:'center',
              gap:4,
              transition:'all .15s',
            }}
          >
            <RiRefreshLine size={12} />
            {t('settings.syncTime', { defaultValue: 'Sincronizar' })}
          </button>
        </div>
      </div>

      {editing && (
        <div style={{ padding:'14px', borderRadius:12, background:'var(--surface-hover)', border:'1px solid var(--border)', marginBottom:12 }}>
          <div style={{ fontSize:11, color:'var(--text-ter)', marginBottom:8 }}>
            {t('settings.adjustTime', { defaultValue: 'Ajustar horário manual' })}
          </div>
          <input
            type="datetime-local"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            style={{
              width:'100%',
              padding:'10px 12px',
              borderRadius:8,
              border:'1px solid var(--border)',
              background:'var(--bg)',
              color:'var(--text-pri)',
              fontSize:12,
              fontFamily:'inherit',
              marginBottom:10,
              boxSizing:'border-box',
            }}
          />
          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={handleManualTimeSubmit}
              style={{
                flex:1,
                padding:'8px 12px',
                borderRadius:8,
                border:'1px solid var(--accent)',
                background:'var(--accent)',
                color:'#fff',
                fontSize:12,
                cursor:'pointer',
                fontFamily:'inherit',
                fontWeight:500,
                transition:'all .15s',
              }}
            >
              {t('settings.confirm', { defaultValue: 'Confirmar' })}
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                flex:1,
                padding:'8px 12px',
                borderRadius:8,
                border:'1px solid var(--border)',
                background:'transparent',
                color:'var(--text-sec)',
                fontSize:12,
                cursor:'pointer',
                fontFamily:'inherit',
                transition:'all .15s',
              }}
            >
              {t('settings.cancel', { defaultValue: 'Cancelar' })}
            </button>
          </div>
        </div>
      )}

      <div style={{ fontSize:10, color:'var(--text-ter)', lineHeight:1.6 }}>
        {mode === 'online' ? (
          <span>{t('settings.onlineDesc', { defaultValue: 'Tempo sincronizado via API quando online. Usa horário local quando offline.' })}</span>
        ) : (
          <span>{t('settings.offlineDesc', { defaultValue: 'Tempo manual definido por você. Continue contando mesmo sem conexão.' })}</span>
        )}
      </div>
    </div>
  )
}
