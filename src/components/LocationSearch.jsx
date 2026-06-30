import React, { useState, useRef, useCallback } from 'react'
import s from './LocationSearch.module.css'
import { searchLocations, normalizeStr } from '../data/locations'

const TYPE_LABELS = {
  village: '🌿 Fshat',
  hamlet: '🌿 Vendbanim',
  suburb: '📍 Lagje',
  neighbourhood: '📍 Lagje',
  city: '🏙️ Qytet',
  town: '🏘️ Qytezë',
  municipality: '🏛️ Komunë',
  county: '🏛️ Rajon',
  residential: '🏘️ Zonë',
  quarter: '📍 Lagje',
}

const LOCAL_TYPE_ICON = {
  Kryeqytet: '🏛️', Qytet: '🏙️', Komunë: '🏘️', Lagje: '📍', Fshat: '🌿'
}

export default function LocationSearch({ value, onChange, placeholder }) {
  const [osmResults, setOsmResults] = useState([])
  const [localResults, setLocalResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const timerRef = useRef(null)
  const abortRef = useRef(null)

  const searchOsm = useCallback(async (query) => {
    setLoading(true)
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    try {
      const url = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query + ', Kosovo')}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=8&` +
        `countrycodes=xk&` +
        `accept-language=sq,de,en&` +
        `dedupe=1`

      const res = await fetch(url, {
        signal: abortRef.current.signal,
        headers: { 'Accept-Language': 'sq,de,en' }
      })
      const data = await res.json()
      setOsmResults(data || [])
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('Nominatim error:', e)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInput = (val) => {
    onChange(val)

    if (!val || val.length < 2) {
      setLocalResults([])
      setOsmResults([])
      setShowDrop(false)
      return
    }

    // Local results show instantly (no debounce) - covers all known villages/towns + aliases
    const local = searchLocations(val, 6)
    setLocalResults(local)
    setShowDrop(true)

    // OSM search debounced, for anything local list doesn't cover
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => searchOsm(val), 350)
  }

  const selectLocal = (loc) => {
    onChange(loc.name)
    setLocalResults([])
    setOsmResults([])
    setShowDrop(false)
  }

  const selectOsm = (item) => {
    const addr = item.address || {}
    const parts = []
    if (addr.village) parts.push(addr.village)
    else if (addr.town) parts.push(addr.town)
    else if (addr.city) parts.push(addr.city)
    else if (addr.suburb) parts.push(addr.suburb)
    else if (addr.neighbourhood) parts.push(addr.neighbourhood)
    else parts.push(item.display_name.split(',')[0])

    if (addr.county && !parts[0]?.includes(addr.county)) {
      parts.push(addr.county)
    }

    onChange(parts.join(', '))
    setLocalResults([])
    setOsmResults([])
    setShowDrop(false)
  }

  const getLabel = (item) => {
    const t = item.type || item.class
    return TYPE_LABELS[t] || '📍 Vendndodhje'
  }

  const getMainName = (item) => {
    const addr = item.address || {}
    return addr.village || addr.hamlet || addr.suburb || addr.neighbourhood ||
      addr.town || addr.city_district || addr.city ||
      item.display_name.split(',')[0]
  }

  const getSubName = (item) => {
    const addr = item.address || {}
    const parts = []
    if (addr.municipality) parts.push(addr.municipality)
    else if (addr.county) parts.push(addr.county)
    if (addr.state && addr.state !== 'Kosovo') parts.push(addr.state)
    return parts.join(' · ') || 'Kosovë'
  }

  // Dedupe OSM results against local results (avoid showing "Pejë" twice)
  const localNamesNorm = new Set(localResults.map(l => normalizeStr(l.name)))
  const filteredOsm = osmResults.filter(item => {
    const mainName = normalizeStr(getMainName(item))
    return !localNamesNorm.has(mainName)
  }).slice(0, 5)

  const noResults = localResults.length === 0 && filteredOsm.length === 0 && !loading

  return (
    <div className={s.wrap}>
      <div className={s.inputRow}>
        <svg className={s.ico} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2">
          <path d="M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0"/>
          <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
        </svg>
        <input
          className={s.input}
          type="text"
          value={value}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => value.length >= 2 && (localResults.length > 0 || osmResults.length > 0) && setShowDrop(true)}
          onBlur={() => setTimeout(() => setShowDrop(false), 200)}
          placeholder={placeholder || 'P.sh., Lutogllavë, Zahaq, Pejë...'}
          autoComplete="off"
          spellCheck="false"
        />
        {loading && <div className={s.spinner}/>}
        {value && !loading && (
          <button className={s.clearBtn} onMouseDown={() => { onChange(''); setLocalResults([]); setOsmResults([]); setShowDrop(false) }}>✕</button>
        )}
      </div>

      {showDrop && (
        <div className={s.dropdown}>
          {noResults ? (
            <div className={s.noResults}>
              <span>🔍</span>
              <div>
                <div className={s.noResultsTitle}>Asnjë rezultat</div>
                <div className={s.noResultsSub}>Provoni me emër tjetër</div>
              </div>
            </div>
          ) : (
            <>
              {localResults.map((loc, i) => (
                <div
                  key={`local-${i}`}
                  className={s.item}
                  onMouseDown={() => selectLocal(loc)}
                >
                  <div className={s.itemIcon}>{LOCAL_TYPE_ICON[loc.type] || '📍'}</div>
                  <div className={s.itemText}>
                    <div className={s.itemMain}>{loc.name}</div>
                    <div className={s.itemSub}>{loc.region} · <span className={s.itemType}>{loc.type}</span></div>
                  </div>
                </div>
              ))}
              {filteredOsm.map((item, i) => (
                <div
                  key={`osm-${item.place_id || i}`}
                  className={s.item}
                  onMouseDown={() => selectOsm(item)}
                >
                  <div className={s.itemIcon}>{getLabel(item).split(' ')[0]}</div>
                  <div className={s.itemText}>
                    <div className={s.itemMain}>{getMainName(item)}</div>
                    <div className={s.itemSub}>{getSubName(item)} · <span className={s.itemType}>{getLabel(item).split(' ').slice(1).join(' ')}</span></div>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className={s.powered}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Vendndodhje Kosovë + OpenStreetMap
          </div>
        </div>
      )}
    </div>
  )
}
