import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import s from './AuthModal.module.css'

function EyeIcon({ open }) {
  return open
    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
}

function pwStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const colors = ['#E53935','#FF7043','#FFA726','#66BB6A']
  const labels = { de: ['Sehr schwach','Schwach','Mittel','Stark'], sq: ['Shumë dobët','Dobët','Mesatar','Fortë'], en: ['Very weak','Weak','Medium','Strong'] }
  return { score, color: colors[score - 1] || '#eee', width: score * 25, label: pw.length ? (labels['sq'][score - 1] || '') : '' }
}

export default function AuthModal() {
  const { authOpen, authTab, setAuthTab, closeAuth, doLogin, doRegister, T, showToast } = useApp()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const strength = pwStrength(pw)

  if (!authOpen) return null

  const reset = () => { setEmail(''); setPw(''); setPw2(''); setFirstName(''); setLastName(''); setError(''); setShowPw(false); setShowPw2(false) }

  const handleLogin = async () => {
    if (!email || !pw) { setError(T('auth.err.fill')); return }
    setLoading(true)
    const err = await doLogin(email, pw)
    setLoading(false)
    if (err) { setError(err); return }
    reset()
  }

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !pw || !pw2) { setError(T('auth.err.fill')); return }
    if (pw !== pw2) { setError(T('auth.err.pw')); return }
    if (pw.length < 6) { setError('Fjalëkalimi duhet të ketë minimum 6 karaktere.'); return }
    setLoading(true)
    const err = await doRegister({ firstName, lastName, email, pw, phone: '' })
    setLoading(false)
    if (err) { setError(err); return }
    reset()
  }

  const switchTab = (tab) => { setAuthTab(tab); setError('') }

  const socialLogin = (p) => showToast(`⚠ ${p}-Login Demo`)

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && closeAuth()}>
      <div className={s.modal}>

        {/* LOGIN */}
        {authTab === 'login' && (
          <div className={s.body}>
            <h3 className={s.title}>{T('auth.loginTitle')}</h3>
            {error && <div className={s.error}>{error}</div>}

            <div className={s.fieldWrap}>
              <input className={s.fieldInput} type="text" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
              <label className={s.fieldLabel}>{T('auth.emailLabel')}</label>
            </div>

            <div className={s.fieldWrap}>
              <input className={s.fieldInput} type={showPw ? 'text' : 'password'} placeholder=" " value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" />
              <label className={s.fieldLabel}>{T('auth.pwLabel')}</label>
              <button type="button" className={s.eyeBtn} onClick={() => setShowPw(!showPw)}><EyeIcon open={showPw} /></button>
            </div>

            <button className={s.forgotBtn} onClick={() => showToast('Email e dërguar ✓', 'success')}>{T('auth.forgotPw')}</button>
            <button className={s.mainBtn} onClick={handleLogin} disabled={loading}>{loading ? '...' : T('auth.loginBtn')}</button>
            <button className={s.switchLink} onClick={() => switchTab('register')}>{T('auth.newAccount')}</button>

            <div className={s.orDiv}><span>ODER</span></div>
            <SocialBtns T={T} onClick={socialLogin} />
          </div>
        )}

        {/* REGISTER */}
        {authTab === 'register' && (
          <div className={s.body}>
            <h3 className={s.title}>{T('auth.registerTitle')}</h3>
            {error && <div className={s.error}>{error}</div>}

            <div className={s.nameRow}>
              <div className={s.fieldWrap}>
                <input className={s.fieldInput} type="text" placeholder=" " value={firstName} onChange={e => setFirstName(e.target.value)} />
                <label className={s.fieldLabel}>{T('auth.firstName')}</label>
              </div>
              <div className={s.fieldWrap}>
                <input className={s.fieldInput} type="text" placeholder=" " value={lastName} onChange={e => setLastName(e.target.value)} />
                <label className={s.fieldLabel}>{T('auth.lastName')}</label>
              </div>
            </div>

            <div className={s.fieldWrap}>
              <input className={s.fieldInput} type="email" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <label className={s.fieldLabel}>{T('auth.emailLabel')}</label>
            </div>

            <div className={s.fieldWrap}>
              <input className={s.fieldInput} type={showPw ? 'text' : 'password'} placeholder=" " value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" />
              <label className={s.fieldLabel}>{T('auth.pwLabel')}</label>
              <button type="button" className={s.eyeBtn} onClick={() => setShowPw(!showPw)}><EyeIcon open={showPw} /></button>
            </div>
            {pw && (
              <>
                <div className={s.strengthBar}><div style={{ width: strength.width + '%', background: strength.color }} /></div>
                <div className={s.strengthLabel} style={{ color: strength.color }}>{strength.label}</div>
              </>
            )}

            <div className={s.fieldWrap}>
              <input className={s.fieldInput} type={showPw2 ? 'text' : 'password'} placeholder=" " value={pw2} onChange={e => setPw2(e.target.value)} autoComplete="new-password" />
              <label className={s.fieldLabel}>{T('auth.confirmPw')}</label>
              <button type="button" className={s.eyeBtn} onClick={() => setShowPw2(!showPw2)}><EyeIcon open={showPw2} /></button>
            </div>

            <button className={s.mainBtn} onClick={handleRegister} disabled={loading}>{loading ? '...' : T('auth.registerBtn')}</button>
            <button className={s.switchLink} onClick={() => switchTab('login')}>{T('auth.alreadyAccount')}</button>

            <div className={s.orDiv}><span>ODER</span></div>
            <SocialBtns T={T} onClick={socialLogin} />
          </div>
        )}

      </div>
    </div>
  )
}

function SocialBtns({ T, onClick }) {
  return (
    <>
      <button className={s.socialBtn} onClick={() => onClick('Google')}>
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        <span>{T('auth.google')}</span>
      </button>
      <button className={s.socialBtn} onClick={() => onClick('Apple')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        <span>{T('auth.apple')}</span>
      </button>
      <button className={s.socialBtn} onClick={() => onClick('Facebook')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        <span>{T('auth.facebook')}</span>
      </button>
    </>
  )
}
