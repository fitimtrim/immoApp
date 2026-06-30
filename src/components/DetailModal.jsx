import React from 'react'
import { useApp } from '../context/AppContext'
import s from './DetailModal.module.css'

export default function DetailModal() {
  const { detailListing, setDetailListing, T } = useApp()
  if (!detailListing) return null
  const l = detailListing
  const av = (l.agent || 'IP').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && setDetailListing(null)}>
      <div className={s.modal}>
        <div className={s.header}>
          <h2>{l.title}</h2>
          <button className={s.close} onClick={() => setDetailListing(null)}>✕</button>
        </div>

        <div className={s.imgArea}>
          {l.photos && l.photos.length > 0
            ? <img src={l.photos[0]} alt={l.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            : <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--c3)" strokeWidth="1" opacity=".3"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          }
        </div>

        <div className={s.body}>
          <div className={s.meta}>
            <div>
              <div className={s.type}>{l.type}</div>
              <h3 className={s.title}>{l.title}</h3>
              <div className={s.loc}>📍 {l.loc}</div>
            </div>
            <div className={s.price}>{l.price} <span>{l.priceLabel}</span></div>
          </div>

          <div className={s.stats}>
            <div className={s.stat}><strong>{l.rooms}</strong><span>{T('detail.rooms')}</span></div>
            <div className={s.stat}><strong>{l.area}</strong><span>{T('detail.area')}</span></div>
            <div className={s.stat}><strong>{l.floor || '–'}</strong><span>{T('detail.floor')}</span></div>
            <div className={s.stat}><strong>{l.year || '–'}</strong><span>{T('detail.year')}</span></div>
          </div>

          <div className={s.section}>
            <h4>{T('detail.desc')}</h4>
            <p>{l.desc || '–'}</p>
          </div>

          {l.features && l.features.length > 0 && (
            <div className={s.section}>
              <h4>{T('detail.features')}</h4>
              <div className={s.features}>
                {l.features.map((f, i) => <div key={i} className={s.feature}>✓ {f}</div>)}
              </div>
            </div>
          )}

          <div className={s.contactCard}>
            <div className={s.agentAv}>{av}</div>
            <div className={s.agentInfo}>
              <strong>{l.agent || 'ViaHome24'}</strong>
              <span>Ndërmjetës · ViaHome24</span>
            </div>
            <div className={s.contactBtns}>
              <button className={s.btnOutline}>{T('detail.call')}</button>
              <button className={s.btnPrimary}>{T('detail.contact')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
