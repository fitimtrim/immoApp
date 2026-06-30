// Toast.jsx
import React from 'react'
import { useApp } from '../context/AppContext'

export function Toast() {
  const { toast } = useApp()
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: `translateX(-50%) translateY(${toast.visible ? '0' : '100px'})`,
      background: toast.type === 'success' ? '#2E7D32' : toast.type === 'error' ? '#C62828' : 'var(--c1)',
      color: '#fff', padding: '11px 22px', borderRadius: 24,
      fontSize: 13, fontWeight: 500, zIndex: 999,
      transition: '.35s', whiteSpace: 'nowrap',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: 8,
      pointerEvents: 'none',
    }}>
      {toast.msg}
    </div>
  )
}
export default Toast
