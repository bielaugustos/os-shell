import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getNotes, saveNote, deleteNote } from '../core/db'

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return mobile
}

export default function NotesApp() {
  const { t } = useTranslation()
  const [notes,   setNotes]   = useState([])
  const [active,  setActive]  = useState(null)
  const [title,   setTitle]   = useState('')
  const [body,    setBody]    = useState('')
  const [search,  setSearch]  = useState('')
  const [showList, setShowList] = useState(true)
  const titleRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => { getNotes().then(n => { setNotes(n); if (n[0]) selectNote(n[0]) }) }, [])

  const selectNote = (n) => {
    setActive(n.id); setTitle(n.title); setBody(n.body)
    if (isMobile) setShowList(false)
  }

  const persist = async () => {
    if (active == null) return
    const updated = { id: active, title, body, pinned: false }
    await saveNote(updated)
    setNotes(prev => prev.map(n => n.id === active ? { ...n, title, body } : n))
  }

  const newNote = async () => {
    const note = { title: '', body: '', pinned: false }
    const id = await saveNote(note)
    const created = { ...note, id }
    setNotes(prev => [created, ...prev])
    selectNote(created)
    setTimeout(() => titleRef.current?.focus(), 50)
  }

  const remove = async (id, e) => {
    e.stopPropagation()
    await deleteNote(id)
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id)
      if (active === id) { if (next[0]) selectNote(next[0]); else { setActive(null); setTitle(''); setBody('') } }
      return next
    })
  }

  const filtered = notes.filter(n =>
    !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase())
  )

  const showSidebar = !isMobile || showList
  const showEditor  = !isMobile || !showList

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {showSidebar && (
        <div style={{
          width: isMobile ? '100%' : 220,
          borderRight: isMobile ? 'none' : '1px solid var(--border)',
          display:'flex', flexDirection:'column', flexShrink:0,
        }}>
          <div style={{ display:'flex', gap:8, padding:'12px 12px 8px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
            <input
              style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'7px 10px', fontSize:13, color:'var(--text-pri)', fontFamily:'inherit' }}
              placeholder={t('notes.search')} value={search} onChange={e => setSearch(e.target.value)}
            />
            <button
              style={{ width:28, height:28, borderRadius:8, background:'var(--accent-dim)', border:'none', color:'var(--accent)', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}
              onClick={newNote}
            >+</button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {filtered.length === 0 && <div style={{ padding:'20px 12px', fontSize:12, color:'var(--text-ter)', textAlign:'center' }}>No notes</div>}
            {filtered.map(n => (
              <div key={n.id} onClick={() => selectNote(n)} style={{
                padding:'10px 12px', cursor:'pointer',
                borderLeft:`2px solid ${n.id === active ? 'var(--accent)' : 'transparent'}`,
                background: n.id === active ? 'var(--surface-hover)' : 'transparent',
                display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                transition:'background .12s',
              }}>
                <div style={{ flex:1, overflow:'hidden' }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--text-pri)', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', marginBottom:2 }}>
                    {n.title || t('notes.untitled')}
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-ter)', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>
                    {n.body?.slice(0, 45) || '—'}
                  </div>
                </div>
                <button onClick={e => remove(n.id, e)} style={{ background:'none', border:'none', color:'var(--text-ter)', cursor:'pointer', fontSize:15, padding:'0 0 0 4px', flexShrink:0 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showEditor && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {active != null ? (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid var(--border)', flexShrink:0 }}>
                {isMobile && (
                  <button onClick={() => setShowList(true)} style={{
                    background:'none', border:'none', color:'var(--text-sec)', fontSize:18, padding:'12px 0 12px 14px', cursor:'pointer',
                    display:'flex', alignItems:'center',
                  }}>←</button>
                )}
                <input ref={titleRef} style={{
                  fontFamily:'Syne', fontSize:20, fontWeight:600, color:'var(--text-pri)',
                  background:'none', border:'none', outline:'none',
                  padding: isMobile ? '16px 20px 12px 4px' : '20px 24px 10px',
                  flex:1,
                }} value={title} onChange={e => setTitle(e.target.value)} onBlur={persist} placeholder={t('notes.untitled')} />
              </div>
              <textarea style={{
                flex:1, background:'none', border:'none', outline:'none',
                padding: isMobile ? '12px 16px' : '16px 24px',
                fontSize:14, color:'var(--text-sec)', lineHeight:1.75, resize:'none',
                fontFamily:'DM Sans', fontWeight:300,
              }} value={body} onChange={e => setBody(e.target.value)} onBlur={persist} placeholder={t('notes.placeholder')} />
            </>
          ) : (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-ter)', fontSize:13 }}>
              {isMobile ? '← ' + t('notes.new') : 'Select a note or create one →'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
