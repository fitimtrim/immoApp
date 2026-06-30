import React, { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import s from './SearchBar.module.css'
import LocationSearch from './LocationSearch'

const PRICE_STEPS = [0, 10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000, 1500000, 2000000]
const ROOM_STEPS = ['1', '1+1', '2+1', '3+1', '4+1', '5+']

function formatPrice(val) {
  if (val === 0) return '€ 0'
  if (val >= 1000000) return `€ ${(val/1000000).toFixed(1)}M`
  if (val >= 1000) return `€ ${(val/1000).toFixed(0)}K`
  return `€ ${val}`
}

export default function SearchBar() {
  const { T, setFilterOpen, showToast, setActiveFilters, activeFilters } = useApp()
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('+ 0km')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(PRICE_STEPS.length - 1)
  const [roomMin, setRoomMin] = useState(0)
  const [roomMax, setRoomMax] = useState(ROOM_STEPS.length - 1)
  const [showPriceRange, setShowPriceRange] = useState(false)
  const [showRoomRange, setShowRoomRange] = useState(false)
  const priceRef = useRef()
  const roomRef = useRef()

  const priceLabel = priceMin === 0 && priceMax === PRICE_STEPS.length - 1
    ? 'alle Preise'
    : `${formatPrice(PRICE_STEPS[priceMin])} – ${formatPrice(PRICE_STEPS[priceMax])}`

  const roomLabel = roomMin === 0 && roomMax === ROOM_STEPS.length - 1
    ? 'alle Zimmer'
    : `${ROOM_STEPS[roomMin]} – ${ROOM_STEPS[roomMax]}`

  const doSearch = () => {
    setActiveFilters(prev => ({
      ...prev,
      ...(location ? { location } : {}),
      priceFrom: PRICE_STEPS[priceMin],
      priceTo: PRICE_STEPS[priceMax],
      roomsFrom: ROOM_STEPS[roomMin],
      roomsTo: ROOM_STEPS[roomMax],
    }))
    setShowPriceRange(false)
    setShowRoomRange(false)
    showToast(T('toast.searching'), 'success')
  }

  // Close dropdowns on outside click
  const handleBlurPrice = () => setTimeout(() => setShowPriceRange(false), 200)
  const handleBlurRoom = () => setTimeout(() => setShowRoomRange(false), 200)

  return (
    <div className={s.wrap}>

      {/* ── DESKTOP ── */}
      <div className={s.desktop}>
        {/* 1. Ort */}
        <div className={s.locWrap}>
          <div className={s.field} style={{paddingTop:0,paddingBottom:0,border:'none',background:'transparent'}}>
            <div className={s.fieldInner} style={{padding:'6px 0'}}>
              <span className={s.label}>{T('search.where')}</span>
              <LocationSearch
                value={location}
                onChange={setLocation}
                placeholder={T('search.place')}
              />
            </div>
          </div>
        </div>
        <div className={s.divider} />

        {/* 2. Radius */}
        <div className={s.field + ' ' + s.fieldSm}>
          <div className={s.fieldInner}>
            <span className={s.label}>{T('search.radius')}</span>
            <select className={s.select} value={radius} onChange={e => setRadius(e.target.value)}>
              <option>+ 0km</option><option>+ 5km</option><option>+ 10km</option>
              <option>+ 20km</option><option>+ 30km</option><option>+ 50km</option>
            </select>
          </div>
        </div>
        <div className={s.divider} />

        {/* 3. Preis Range */}
        <div className={s.rangeWrap} ref={priceRef}>
          <div className={s.field + ' ' + s.fieldMd} onClick={() => { setShowPriceRange(!showPriceRange); setShowRoomRange(false) }}>
            <div className={s.fieldInner}>
              <span className={s.label}>{T('search.priceTo')}</span>
              <span className={s.rangeVal}>{priceLabel}</span>
            </div>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" style={{flexShrink:0}}><path d="M6 9l6 6 6-6"/></svg>
          </div>
          {showPriceRange && (
            <div className={s.rangeDrop} onMouseDown={e => e.preventDefault()}>
              <div className={s.rangeDropTitle}>Preis (€)</div>
              <div className={s.rangeLabels}>
                <span>{formatPrice(PRICE_STEPS[priceMin])}</span>
                <span>{formatPrice(PRICE_STEPS[priceMax])}</span>
              </div>
              <div className={s.sliderWrap}>
                <div className={s.sliderTrack}>
                  <div className={s.sliderFill} style={{
                    left: `${(priceMin / (PRICE_STEPS.length-1)) * 100}%`,
                    width: `${((priceMax - priceMin) / (PRICE_STEPS.length-1)) * 100}%`
                  }}/>
                </div>
                <input type="range" className={s.slider} min={0} max={PRICE_STEPS.length-1}
                  value={priceMin} onChange={e => { const v=+e.target.value; if(v<=priceMax) setPriceMin(v) }} />
                <input type="range" className={s.slider} min={0} max={PRICE_STEPS.length-1}
                  value={priceMax} onChange={e => { const v=+e.target.value; if(v>=priceMin) setPriceMax(v) }} />
              </div>
              <div className={s.rangeSteps}>
                <span>€ 0</span><span>€ 500K</span><span>€ 2M</span>
              </div>
              <button className={s.rangeApply} onClick={() => setShowPriceRange(false)}>Übernehmen</button>
            </div>
          )}
        </div>
        <div className={s.divider} />

        {/* 4. Zimmer Range */}
        <div className={s.rangeWrap} ref={roomRef}>
          <div className={s.field + ' ' + s.fieldMd} onClick={() => { setShowRoomRange(!showRoomRange); setShowPriceRange(false) }}>
            <div className={s.fieldInner}>
              <span className={s.label}>{T('search.roomsFrom')}</span>
              <span className={s.rangeVal}>{roomLabel}</span>
            </div>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" style={{flexShrink:0}}><path d="M6 9l6 6 6-6"/></svg>
          </div>
          {showRoomRange && (
            <div className={s.rangeDrop} onMouseDown={e => e.preventDefault()}>
              <div className={s.rangeDropTitle}>Zimmer</div>
              <div className={s.rangeLabels}>
                <span>{ROOM_STEPS[roomMin]}</span>
                <span>{ROOM_STEPS[roomMax]}</span>
              </div>
              <div className={s.sliderWrap}>
                <div className={s.sliderTrack}>
                  <div className={s.sliderFill} style={{
                    left: `${(roomMin / (ROOM_STEPS.length-1)) * 100}%`,
                    width: `${((roomMax - roomMin) / (ROOM_STEPS.length-1)) * 100}%`
                  }}/>
                </div>
                <input type="range" className={s.slider} min={0} max={ROOM_STEPS.length-1}
                  value={roomMin} onChange={e => { const v=+e.target.value; if(v<=roomMax) setRoomMin(v) }} />
                <input type="range" className={s.slider} min={0} max={ROOM_STEPS.length-1}
                  value={roomMax} onChange={e => { const v=+e.target.value; if(v>=roomMin) setRoomMax(v) }} />
              </div>
              <div className={s.rangeSteps}>
                {ROOM_STEPS.map((r,i) => <span key={i}>{r}</span>)}
              </div>
              <button className={s.rangeApply} onClick={() => setShowRoomRange(false)}>Übernehmen</button>
            </div>
          )}
        </div>
        <div className={s.divider} />

        {/* 5. Filter */}
        <button className={s.filterBtn} onClick={() => setFilterOpen(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 6h16M7 12h10M10 18h4"/>
          </svg>
          <span>{T('search.filter')}</span>
        </button>

        {/* 6. Suchen */}
        <button className={s.searchBtn} onClick={doSearch}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <span>{T('search.btn')}</span>
        </button>
      </div>

      {/* ── MOBILE ── */}
      <div className={s.mobile}>
        {/* Row 1: Location */}
        <div className={s.mobLocWrap}>
          <LocationSearch
            value={location}
            onChange={setLocation}
            placeholder={T('search.place')}
          />
        </div>

        {/* Row 2: Price Range + Room Range */}
        <div className={s.mobRow2}>
          {/* Price */}
          <div className={s.mobRangeWrap}>
            <div className={s.mobSelWrap} onClick={() => { setShowPriceRange(!showPriceRange); setShowRoomRange(false) }}>
              <label className={s.mobSelLbl}>{T('search.priceTo')}</label>
              <div className={s.mobRangeVal}>{priceLabel} ▾</div>
            </div>
            {showPriceRange && (
              <div className={s.mobRangeDrop} onMouseDown={e => e.preventDefault()}>
                <div className={s.rangeLabels}><span>{formatPrice(PRICE_STEPS[priceMin])}</span><span>{formatPrice(PRICE_STEPS[priceMax])}</span></div>
                <div className={s.sliderWrap}>
                  <div className={s.sliderTrack}>
                    <div className={s.sliderFill} style={{left:`${(priceMin/(PRICE_STEPS.length-1))*100}%`,width:`${((priceMax-priceMin)/(PRICE_STEPS.length-1))*100}%`}}/>
                  </div>
                  <input type="range" className={s.slider} min={0} max={PRICE_STEPS.length-1} value={priceMin} onChange={e=>{const v=+e.target.value;if(v<=priceMax)setPriceMin(v)}}/>
                  <input type="range" className={s.slider} min={0} max={PRICE_STEPS.length-1} value={priceMax} onChange={e=>{const v=+e.target.value;if(v>=priceMin)setPriceMax(v)}}/>
                </div>
                <button className={s.rangeApply} onClick={()=>setShowPriceRange(false)}>OK</button>
              </div>
            )}
          </div>
          {/* Rooms */}
          <div className={s.mobRangeWrap}>
            <div className={s.mobSelWrap} onClick={() => { setShowRoomRange(!showRoomRange); setShowPriceRange(false) }}>
              <label className={s.mobSelLbl}>{T('search.roomsFrom')}</label>
              <div className={s.mobRangeVal}>{roomLabel} ▾</div>
            </div>
            {showRoomRange && (
              <div className={s.mobRangeDrop} onMouseDown={e => e.preventDefault()}>
                <div className={s.rangeLabels}><span>{ROOM_STEPS[roomMin]}</span><span>{ROOM_STEPS[roomMax]}</span></div>
                <div className={s.sliderWrap}>
                  <div className={s.sliderTrack}>
                    <div className={s.sliderFill} style={{left:`${(roomMin/(ROOM_STEPS.length-1))*100}%`,width:`${((roomMax-roomMin)/(ROOM_STEPS.length-1))*100}%`}}/>
                  </div>
                  <input type="range" className={s.slider} min={0} max={ROOM_STEPS.length-1} value={roomMin} onChange={e=>{const v=+e.target.value;if(v<=roomMax)setRoomMin(v)}}/>
                  <input type="range" className={s.slider} min={0} max={ROOM_STEPS.length-1} value={roomMax} onChange={e=>{const v=+e.target.value;if(v>=roomMin)setRoomMax(v)}}/>
                </div>
                <button className={s.rangeApply} onClick={()=>setShowRoomRange(false)}>OK</button>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Filter + Search */}
        <div className={s.mobBtns}>
          <button className={s.mobFilterBtn} onClick={() => setFilterOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
            {T('search.filter')}
          </button>
          <button className={s.mobSearchBtn} onClick={doSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            {T('search.btn')}
          </button>
        </div>
      </div>

    </div>
  )
}
