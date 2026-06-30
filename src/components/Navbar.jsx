import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import s from './Navbar.module.css'

const LANGS = [
  { code: 'sq', flag: '🇦🇱', label: 'Shqip' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
]

export default function Navbar() {
  const { T, lang, setLang, currentUser, logout, openAuth } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const goProtected = (path) => {
    if (!currentUser) { openAuth('login'); return }
    navigate(path)
    setMenuOpen(false)
  }

  const initials = currentUser
    ? ((currentUser.firstName?.[0] || '') + (currentUser.lastName?.[0] || '')).toUpperCase()
    : ''

  const currentLang = LANGS.find(l => l.code === lang) || LANGS[0]

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={s.nav}>
        {/* Logo */}
        <a className={s.logo} onClick={() => { navigate('/'); closeMenu() }}>
          <img src="/logo.svg" alt="ViaHome24" className={s.logoSvg} width="48" height="40" style={{objectFit:'contain'}}/>
          <div className={s.logoText}>
            <div className={s.logoName}>Via<span className={s.logoOrange}>Home</span>24</div>
            <div className={s.logoTagline}>Gjej pronën tënde ideale</div>
          </div>
        </a>

        {/* Desktop nav links */}
        <ul className={s.links}>
          <li><a onClick={() => navigate('/')}>{T('footer.home')}</a></li>
          <li><a onClick={() => navigate('/')}>{T('footer.listings')}</a></li>
          <li><a onClick={() => navigate('/')}>{T('footer.agents')}</a></li>
          <li><a onClick={() => navigate('/')}>{T('footer.support')}</a></li>
        </ul>

        {/* Desktop right */}
        <div className={s.right}>
          {/* Lang selector desktop */}
          <select className={s.langSel} value={lang} onChange={e => setLang(e.target.value)}>
            {LANGS.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.code.toUpperCase()}</option>
            ))}
          </select>

          {!currentUser ? (
            <div className={s.guestBtns}>
              <button className={s.btnGhost} onClick={() => openAuth('login')}>{T('nav.login')}</button>
              <button className={s.btnPrimary} onClick={() => openAuth('register')}>{T('nav.register')}</button>
            </div>
          ) : (
            <div className={s.userBtns}>
              <button className={s.btnPrimary} onClick={() => goProtected('/create')}>+ {T('nav.addListing')}</button>
              <div className={s.avatar} onClick={() => goProtected('/profile')}>{initials}</div>
            </div>
          )}

          {/* Hamburger - mobile only */}
          <button
            className={`${s.hamburger} ${menuOpen ? s.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? '✕' : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className={s.mobileMenu}>
          {/* Nav links */}
          <div className={s.mobileLinks}>
            <a className={s.mobileLink} onClick={() => { navigate('/'); closeMenu() }}>{T('footer.home')}</a>
            <a className={s.mobileLink} onClick={() => { navigate('/'); closeMenu() }}>{T('footer.listings')}</a>
            <a className={s.mobileLink} onClick={() => { navigate('/'); closeMenu() }}>{T('footer.agents')}</a>
            <a className={s.mobileLink} onClick={() => { navigate('/'); closeMenu() }}>{T('footer.support')}</a>
            {currentUser && (
              <>
                <a className={s.mobileLink} onClick={() => goProtected('/my-listings')}>{T('nav.myListings')}</a>
                <a className={s.mobileLink} onClick={() => goProtected('/profile')}>Profili</a>
              </>
            )}
          </div>

          {/* Language switcher */}
          <div className={s.mobileLangSection}>
            <div className={s.mobileLangTitle}>Gjuha / Sprache / Language</div>
            <div className={s.mobileLangBtns}>
              {LANGS.map(l => (
                <button
                  key={l.code}
                  className={`${s.mobileLangBtn} ${lang === l.code ? s.mobileLangActive : ''}`}
                  onClick={() => { setLang(l.code); closeMenu() }}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auth buttons */}
          <div className={s.mobileAuth}>
            {!currentUser ? (
              <>
                <button className={s.mobileAuthGhost} onClick={() => { openAuth('login'); closeMenu() }}>
                  {T('nav.login')}
                </button>
                <button className={s.mobileAuthPrimary} onClick={() => { openAuth('register'); closeMenu() }}>
                  {T('nav.register')}
                </button>
              </>
            ) : (
              <>
                <button className={s.mobileAuthPrimary} onClick={() => goProtected('/create')}>
                  + {T('nav.addListing')}
                </button>
                <button className={s.mobileAuthGhost} onClick={() => { logout(); closeMenu() }}>
                  {T('profile.logout')}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {menuOpen && <div className={s.backdrop} onClick={closeMenu} />}
    </>
  )
}
