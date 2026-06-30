import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import LocationSearch from './LocationSearch'
import s from './FilterModal.module.css'

const Sel = ({ label, value, onChange, children }) => (
  <div className={s.field}>
    <label className={s.fieldLbl}>{label}</label>
    <div className={s.selWrap}>
      <select className={s.sel} value={value} onChange={e => onChange(e.target.value)}>
        {children}
      </select>
      <svg className={s.selArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
    </div>
  </div>
)

const FEATURES = [
  'Balkon / Terrasse','Lift','Neubau','Altbau','Swimmingpool',
  'Haustiere erlaubt','Rollstuhlgängig','Parkplatz / Garage','Minergie',
  'Garten','Einbauküche','Smart Home','Klimaanlage','Keller'
]

export default function FilterModal() {
  const { filterOpen, setFilterOpen, T, setActiveFilters, showToast, activeFilters } = useApp()

  const [loc, setLoc]           = useState(activeFilters.location || '')
  const [radius, setRadius]     = useState(activeFilters.radius || '')
  const [offerType, setOffer]   = useState(activeFilters.offerType || '')
  const [category, setCat]      = useState(activeFilters.category || '')
  const [priceFrom, setPF]      = useState(activeFilters.priceFrom || '')
  const [priceTo, setPT]        = useState(activeFilters.priceTo || '')
  const [priceOnly, setPO]      = useState(false)
  const [roomsFrom, setRF]      = useState(activeFilters.roomsFrom || '')
  const [roomsTo, setRT]        = useState(activeFilters.roomsTo || '')
  const [areaFrom, setAF]       = useState('')
  const [areaTo, setAT]         = useState('')
  const [yearFrom, setYF]       = useState('')
  const [yearTo, setYT]         = useState('')
  const [objType, setOT]        = useState('')
  const [floor, setFloor]       = useState('')
  const [avail, setAvail]       = useState('')
  const [freetext, setFT]       = useState('')
  const [feats, setFeats]       = useState([])

  if (!filterOpen) return null

  const activeCount = [loc,offerType,category,priceFrom,priceTo,roomsFrom,roomsTo,
    areaFrom,areaTo,yearFrom,yearTo,objType,floor,avail,freetext].filter(v=>v).length + feats.length

  const reset = () => {
    setLoc(''); setRadius(''); setOffer(''); setCat('')
    setPF(''); setPT(''); setPO(false)
    setRF(''); setRT(''); setAF(''); setAT('')
    setYF(''); setYT(''); setOT(''); setFloor('')
    setAvail(''); setFT(''); setFeats([])
  }

  const apply = () => {
    const f = {}
    if (loc) f.location = loc
    if (offerType) f.offerType = offerType
    if (category) f.category = category
    if (priceFrom) f.priceFrom = priceFrom
    if (priceTo) f.priceTo = priceTo
    if (roomsFrom) f.roomsFrom = roomsFrom
    if (roomsTo) f.roomsTo = roomsTo
    if (areaFrom) f.areaFrom = areaFrom
    if (areaTo) f.areaTo = areaTo
    if (yearFrom) f.yearFrom = yearFrom
    if (yearTo) f.yearTo = yearTo
    if (objType) f.objType = objType
    if (floor) f.floor = floor
    if (avail) f.avail = avail
    if (freetext) f.freetext = freetext
    if (feats.length) f.features = feats
    setActiveFilters(f)
    setFilterOpen(false)
    showToast('Filtri u aplikua ✓', 'success')
  }

  const toggleFeat = (f) => setFeats(prev =>
    prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
  )

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && setFilterOpen(false)}>
      <div className={s.modal}>

        {/* Header */}
        <div className={s.header}>
          <div className={s.headerLeft}>
            <h2>Filter</h2>
            {activeCount > 0 && <span className={s.countBadge}>{activeCount}</span>}
            {activeCount > 0 && (
              <button className={s.resetBtn} onClick={reset}>Alle Filter zurücksetzen</button>
            )}
          </div>
          <button className={s.closeBtn} onClick={() => setFilterOpen(false)}>✕</button>
        </div>

        <div className={s.body}>

          {/* Wo */}
          <div className={s.fieldGroup}>
            <label className={s.groupLbl}>Wo?</label>
            <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
              <div style={{flex:1}}>
                <LocationSearch
                  value={loc}
                  onChange={setLoc}
                  placeholder="Ort, Dorf, Gemeinde..."
                />
              </div>
              <div className={s.selWrap} style={{width:110,flexShrink:0,marginTop:0}}>
                <select className={s.sel} value={radius} onChange={e => setRadius(e.target.value)}>
                  <option value="">+ 0km</option>
                  <option>+ 5km</option><option>+ 10km</option>
                  <option>+ 20km</option><option>+ 30km</option><option>+ 50km</option>
                </select>
                <svg className={s.selArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Angebotsart */}
          <Sel label="Angebotsart" value={offerType} onChange={setOffer}>
            <option value="">Kaufen &amp; Mieten</option>
            <option value="shitje">Kaufen / Blerje</option>
            <option value="qira">Mieten / Qira</option>
          </Sel>

          {/* Kategorie */}
          <Sel label="Kategorie" value={category} onChange={setCat}>
            <option value="">Wohnung &amp; Haus</option>
            <option>Apartament</option>
            <option>Shtëpi / Villa</option>
            <option>Penthouse</option>
            <option>Tregti / Büro</option>
            <option>Tokë / Grundstück</option>
            <option>Garazh / Parking</option>
          </Sel>

          {/* Preis */}
          <div className={s.fieldGroup}>
            <div className={s.rowLabel}>
              <label className={s.groupLbl}>CHF von</label>
              <label className={s.groupLbl}>Preis bis</label>
            </div>
            <div className={s.row2}>
              <div className={s.selWrap}>
                <select className={s.sel} value={priceFrom} onChange={e => setPF(e.target.value)}>
                  <option value="">alle</option>
                  <option>€ 10.000</option><option>€ 20.000</option><option>€ 30.000</option>
                  <option>€ 50.000</option><option>€ 75.000</option><option>€ 100.000</option>
                  <option>€ 150.000</option><option>€ 200.000</option><option>€ 300.000</option>
                  <option>€ 500.000</option>
                </select>
                <svg className={s.selArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              <div className={s.selWrap}>
                <select className={s.sel} value={priceTo} onChange={e => setPT(e.target.value)}>
                  <option value="">alle</option>
                  <option>€ 30.000</option><option>€ 50.000</option><option>€ 75.000</option>
                  <option>€ 100.000</option><option>€ 150.000</option><option>€ 200.000</option>
                  <option>€ 300.000</option><option>€ 500.000</option><option>€ 1.000.000</option>
                  <option>€ 1.500.000</option><option>€ 2.000.000+</option>
                </select>
                <svg className={s.selArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
            <label className={s.checkRow}>
              <input type="checkbox" checked={priceOnly} onChange={e => setPO(e.target.checked)} style={{accentColor:'#ff6b35'}}/>
              <span>Nur Inserate mit Preis</span>
            </label>
          </div>

          {/* Zimmer */}
          <div className={s.fieldGroup}>
            <div className={s.rowLabel}>
              <label className={s.groupLbl}>Zimmer von</label>
              <label className={s.groupLbl}>Zimmer bis</label>
            </div>
            <div className={s.row2}>
              <div className={s.selWrap}>
                <select className={s.sel} value={roomsFrom} onChange={e => setRF(e.target.value)}>
                  <option value="">alle</option>
                  <option>1</option><option>1+1</option><option>2+1</option>
                  <option>3+1</option><option>4+1</option><option>5+</option>
                </select>
                <svg className={s.selArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              <div className={s.selWrap}>
                <select className={s.sel} value={roomsTo} onChange={e => setRT(e.target.value)}>
                  <option value="">alle</option>
                  <option>1</option><option>1+1</option><option>2+1</option>
                  <option>3+1</option><option>4+1</option><option>5+</option>
                </select>
                <svg className={s.selArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Wohnfläche */}
          <div className={s.fieldGroup}>
            <div className={s.rowLabel}>
              <label className={s.groupLbl}>Wohnfläche von</label>
              <label className={s.groupLbl}>Wohnfläche bis</label>
            </div>
            <div className={s.row2}>
              <div className={s.selWrap}>
                <select className={s.sel} value={areaFrom} onChange={e => setAF(e.target.value)}>
                  <option value="">alle</option>
                  <option>20 m²</option><option>30 m²</option><option>40 m²</option>
                  <option>50 m²</option><option>60 m²</option><option>80 m²</option>
                  <option>100 m²</option><option>120 m²</option><option>150 m²</option>
                </select>
                <svg className={s.selArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              <div className={s.selWrap}>
                <select className={s.sel} value={areaTo} onChange={e => setAT(e.target.value)}>
                  <option value="">alle</option>
                  <option>50 m²</option><option>75 m²</option><option>100 m²</option>
                  <option>120 m²</option><option>150 m²</option><option>200 m²</option>
                  <option>250 m²</option><option>300 m²</option><option>500 m²+</option>
                </select>
                <svg className={s.selArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Baujahr */}
          <div className={s.fieldGroup}>
            <div className={s.rowLabel}>
              <label className={s.groupLbl}>Baujahr von</label>
              <label className={s.groupLbl}>Baujahr bis</label>
            </div>
            <div className={s.row2}>
              <input className={s.inp} type="number" placeholder="" value={yearFrom} onChange={e => setYF(e.target.value)} min="1900" max="2026"/>
              <input className={s.inp} type="number" placeholder="" value={yearTo} onChange={e => setYT(e.target.value)} min="1900" max="2026"/>
            </div>
          </div>

          {/* Objektart */}
          <Sel label="Objektart" value={objType} onChange={setOT}>
            <option value="">alle</option>
            <option>Apartament</option><option>Studio</option><option>Duplex</option>
            <option>Penthouse</option><option>Shtëpi private</option>
            <option>Vilë</option><option>Ferme</option>
          </Sel>

          {/* Etage */}
          <Sel label="Etage" value={floor} onChange={setFloor}>
            <option value="">alle</option>
            <option>Përdhes (EG)</option><option>Kati 1</option><option>Kati 2</option>
            <option>Kati 3</option><option>Kati 4</option><option>Kati 5+</option>
          </Sel>

          {/* Verfügbarkeit */}
          <Sel label="Verfügbarkeit" value={avail} onChange={setAvail}>
            <option value="">alle</option>
            <option>Menjëherë</option><option>1 muaj</option>
            <option>3 muaj</option><option>6 muaj</option>
          </Sel>

          {/* Eigenschaften */}
          <div className={s.fieldGroup}>
            <label className={s.groupLbl} style={{fontWeight:700}}>Eigenschaften</label>
            <div className={s.featsGrid}>
              {FEATURES.map(f => (
                <label key={f} className={s.featItem}>
                  <input type="checkbox" checked={feats.includes(f)}
                    onChange={() => toggleFeat(f)}
                    style={{accentColor:'#ff6b35', width:16, height:16, flexShrink:0}}/>
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Freitextsuche */}
          <div className={s.fieldGroup}>
            <label className={s.groupLbl}>Freitextsuche</label>
            <input className={s.inp} type="text"
              placeholder="Beispiel: Garten, Dusche..."
              maxLength={50}
              value={freetext}
              onChange={e => setFT(e.target.value)}/>
            <div className={s.ftCount}>{freetext.length} / 50</div>
          </div>

        </div>{/* /body */}

        {/* Footer */}
        <div className={s.footer}>
          <button className={s.searchBtn} onClick={apply}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            Suchen
          </button>
        </div>

      </div>
    </div>
  )
}
