import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import s from './ListingCard.module.css'

export default function ListingCard({ listing }) {
  const { T, setDetailListing } = useApp()
  const [faved, setFaved] = useState(false)

  return (
    <div className={`${s.card} ${listing.badge === 'featured' ? s.featured : ''}`}
      onClick={() => setDetailListing(listing)}>

      <div className={s.imgWrap}>
        {listing.photos && listing.photos.length > 0
          ? <img src={listing.photos[0]} alt={listing.title} className={s.img} />
          : (
            <div className={s.imgPh}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--c3)" strokeWidth="1" opacity=".35">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>{listing.loc}</span>
            </div>
          )
        }
        {listing.badge === 'featured' && <span className={s.badgeFeat}>⭐ Top</span>}
        {listing.badge === 'new' && <span className={s.badgeNew}>Ri</span>}
        <button
          className={`${s.fav} ${faved ? s.favActive : ''}`}
          onClick={e => { e.stopPropagation(); setFaved(!faved) }}
          aria-label="Shto në të preferuarat"
        >
          {faved ? '♥' : '♡'}
        </button>
        {listing.photos && listing.photos.length > 0 && (
          <div className={s.photoCount}>📷 {listing.photos.length}</div>
        )}
      </div>

      <div className={s.body}>
        <span className={s.type}>{listing.type}</span>
        <div className={s.title}>{listing.title}</div>
        <div className={s.loc}>📍 {listing.loc}</div>
        <div className={s.tags}>
          {listing.rooms && <span className={s.tag}>🚪 {listing.rooms}</span>}
          {listing.area && <span className={s.tag}>📐 {listing.area}</span>}
          {listing.floor && <span className={s.tag}>🏢 {listing.floor}</span>}
          {listing.year && <span className={s.tag}>📅 {listing.year}</span>}
        </div>
        <div className={s.footer}>
          <div>
            <div className={s.price}>{listing.price} <sub>{listing.priceLabel}</sub></div>
          </div>
          <div className={s.btns}>
            <button className={s.btnIcon} onClick={e => e.stopPropagation()} aria-label="Telefono">📞</button>
            <button className={s.btnPrimary} onClick={e => e.stopPropagation()}>{T('card.contact')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
