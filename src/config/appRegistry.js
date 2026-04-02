import { lazy } from 'react'

export const APP_REGISTRY = [
  { id: 'clock',      color: '#60a5fa', navKey: 'nav.clock',      appKey: 'apps.clock',      iconSize: 26, component: lazy(() => import('../apps/ClockApp'))      },
  { id: 'notes',      color: '#a78bfa', navKey: 'nav.notes',      appKey: 'apps.notes',      iconSize: 26, component: lazy(() => import('../apps/NotesApp'))      },
  { id: 'calculator', color: '#34d399', navKey: 'nav.calculator', appKey: 'apps.calculator', iconSize: 22, component: lazy(() => import('../apps/CalculatorApp')) },
  { id: 'settings',   color: '#94a3b8', navKey: 'nav.settings',   appKey: 'apps.settings',   iconSize: 26, component: lazy(() => import('../apps/SettingsApp'))   },
]

export const getApp = (id) => APP_REGISTRY.find(a => a.id === id) ?? null
