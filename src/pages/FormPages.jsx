// CreatePage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import s from './FormPages.module.css'

export function CreatePage() {
  const { T, currentUser, openAuth, addListing, showToast } = useApp()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])      // preview data URLs
  const [photoFiles, setPhotoFiles] = useState([]) // actual File objects for upload
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    offerType: '', propType: 'Apartament', street: '', city: '', zip: '', region: 'Prishtinë',
    rooms: '', area: '', floor: '', year: '', price: '', nk: '', title: '', desc: ''
  })
  const [features, setFeatures] = useState([])

  useEffect(() => { if (!currentUser) { openAuth('login') } }, [currentUser])
  if (!currentUser) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleFeature = (f) => setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files)
    const remaining = 7 - photos.length
    const toAdd = files.slice(0, remaining)
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setPhotos(prev => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
    setPhotoFiles(prev => [...prev, ...toAdd])
    e.target.value = ''
  }

  const removePhoto = (i) => {
    setPhotos(prev => prev.filter((_,j) => j !== i))
    setPhotoFiles(prev => prev.filter((_,j) => j !== i))
  }

  const submit = async () => {
    if (!form.title || !form.city || !form.price || !form.rooms || !form.area) {
      showToast(T('toast.fillAll'), 'error'); return
    }
    setSubmitting(true)
    const err = await addListing({
      title: form.title,
      type: form.propType,
      offerType: form.offerType,
      loc: `${form.zip} ${form.city}, ${form.region}`,
      priceNum: parseInt(form.price),
      priceLabel: form.offerType === 'Qira' ? '/ muaj' : 'Çmimi i blerjes',
      rooms: form.rooms, area: `${form.area} m²`, floor: form.floor,
      year: form.year, desc: form.desc,
      features: features.length ? features : ['Me kërkesë'],
    }, photoFiles)
    setSubmitting(false)
    if (!err) navigate('/my-listings')
  }

  const FEATS = ['Ballkon/Tarracë','Garazh/Parking','Bodrum','Ashensor','Minergie','Kopsht','Pishinë','Klimatizim','Kuzhinë e integruar','Garazh nëntokësor','Smart Home']

  return (
    <div className={s.page}>
      <h2>{T('create.title')}</h2>
      <p>{T('create.sub')}</p>

      <div className={s.section}><h3><span>1</span>{T('create.s1')}</h3>
        <div className={s.grid2}>
          <div className={s.fg}><label>{T('create.offerType')}</label>
            <select className={s.fi} value={form.offerType} onChange={e => set('offerType', e.target.value)}>
              <option value="Blerje">Blerje / Kaufen</option><option value="Qira">Qira / Mieten</option>
            </select>
          </div>
          <div className={s.fg}><label>{T('create.propType')}</label>
            <select className={s.fi} value={form.propType} onChange={e => set('propType', e.target.value)}>
              <option>Apartament</option><option>Shtëpi</option><option>Vilë</option>
              <option>Penthouse</option><option>Tregti</option><option>Tokë</option><option>Garazh</option>
            </select>
          </div>
        </div>
      </div>

      <div className={s.section}><h3><span>2</span>{T('create.s2')}</h3>
        <div className={s.grid2}>
          <div className={s.fg}><label>{T('create.street')}</label><input className={s.fi} value={form.street} onChange={e => set('street', e.target.value)} placeholder="Rruga Agim Ramadani 12" /></div>
          <div className={s.fg}><label>{T('create.city')}</label><input className={s.fi} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Prishtinë" /></div>
          <div className={s.fg}><label>{T('create.zip')}</label><input className={s.fi} value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="10000" maxLength={6} /></div>
          <div className={s.fg}><label>{T('create.region')}</label>
            <select className={s.fi} value={form.region} onChange={e => set('region', e.target.value)}>
              <option>Prishtinë</option><option>Prizren</option><option>Pejë</option>
              <option>Ferizaj</option><option>Gjakovë</option><option>Mitrovicë</option><option>Gjilan</option>
            </select>
          </div>
        </div>
      </div>

      <div className={s.section}><h3><span>3</span>{T('create.s3')}</h3>
        <div className={s.grid3}>
          <div className={s.fg}><label>{T('create.rooms')}</label><input className={s.fi} type="text" value={form.rooms} onChange={e => set('rooms', e.target.value)} placeholder="3+1" /></div>
          <div className={s.fg}><label>{T('create.area')}</label><input className={s.fi} type="number" value={form.area} onChange={e => set('area', e.target.value)} placeholder="85" /></div>
          <div className={s.fg}><label>{T('create.floor')}</label><input className={s.fi} value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="Kati 3" /></div>
          <div className={s.fg}><label>{T('create.year')}</label><input className={s.fi} type="number" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2020" /></div>
          <div className={s.fg}><label>{T('create.price')}</label><input className={s.fi} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="95000" /></div>
          <div className={s.fg}><label>{T('create.nk')}</label><input className={s.fi} type="number" value={form.nk} onChange={e => set('nk', e.target.value)} placeholder="50" /></div>
        </div>
        <div className={s.fg} style={{marginTop:14}}><label>{T('create.titleField')}</label><input className={s.fi} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Apartament modern 3+1..." /></div>
        <div className={s.fg} style={{marginTop:14}}><label>{T('create.desc')}</label><textarea className={s.fi} value={form.desc} onChange={e => set('desc', e.target.value)} rows={4} placeholder="Përshkruani pronën tuaj..." /></div>
      </div>

      <div className={s.section}><h3><span>4</span>{T('create.s4')}</h3>
        <div className={s.checkboxGroup}>
          {FEATS.map(f => (
            <label key={f} className={`${s.checkItem} ${features.includes(f) ? s.checked : ''}`}>
              <input type="checkbox" checked={features.includes(f)} onChange={() => toggleFeature(f)} style={{accentColor:'var(--c3)'}} /> {f}
            </label>
          ))}
        </div>
      </div>

      <div className={s.section}><h3><span>5</span>{T('create.s5')} <span style={{fontSize:11,color:'var(--muted)',fontWeight:400,marginLeft:6}}>{T('create.photoMax')}</span></h3>
        {photos.length < 7 && (
          <label className={s.uploadArea}>
            <input type="file" accept="image/*" multiple style={{display:'none'}} onChange={handlePhotos} />
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--c3)" strokeWidth="1.5" style={{margin:'0 auto 10px',display:'block'}}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            <p><strong>{T('create.photoClick')}</strong> {T('create.photoDrag')}</p>
            <p style={{fontSize:11,color:'var(--muted)',marginTop:4}}>{T('create.photoHint')}</p>
          </label>
        )}
        {photos.length > 0 && (
          <div className={s.photoGrid}>
            {photos.map((src, i) => (
              <div key={i} className={s.photoThumb}>
                <img src={src} alt="" />
                {i === 0 && <div className={s.coverBadge}>Cover</div>}
                <button className={s.delBtn} onClick={() => removePhoto(i)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={s.formFooter}>
        <button className={s.cancelBtn} onClick={() => navigate('/')}>{T('create.cancel')}</button>
        <button className={s.publishBtn} onClick={submit} disabled={submitting}>
          {submitting ? '...' : T('create.publish')}
        </button>
      </div>
    </div>
  )
}

// MyListingsPage
export function MyListingsPage() {
  const { T, currentUser, openAuth, userListings, deleteListing, setDetailListing, listingsLoading } = useApp()
  const navigate = useNavigate()

  useEffect(() => { if (!currentUser) openAuth('login') }, [currentUser])
  if (!currentUser) return null

  const mine = userListings.filter(l => l.userId === currentUser.id)

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <h2>{T('mylistings.title')}</h2>
        <button className={s.publishBtn} onClick={() => navigate('/create')}>+ {T('mylistings.new')}</button>
      </div>

      {listingsLoading ? (
        <div className={s.empty}><p>Duke ngarkuar…</p></div>
      ) : mine.length === 0 ? (
        <div className={s.empty}>
          <div style={{fontSize:48,marginBottom:12}}>🏠</div>
          <h3>{T('mylistings.empty')}</h3>
          <p>{T('mylistings.emptySub')}</p>
          <button className={s.publishBtn} onClick={() => navigate('/create')}>{T('mylistings.create')}</button>
        </div>
      ) : mine.map(l => (
        <div key={l.id} className={s.myCard}>
          <div className={s.myImg}>
            {l.photos && l.photos.length > 0
              ? <img src={l.photos[0]} alt="" />
              : <span style={{fontSize:28}}>🏠</span>
            }
          </div>
          <div className={s.myBody}>
            <h4>{l.title}</h4>
            <p>📍 {l.loc} · {l.price} {l.priceLabel}</p>
            <div className={s.myMeta}>
              <span className={s.statusActive}>{T('mylistings.active')}</span>
              <span>🚪 {l.rooms} · 📐 {l.area}</span>
              {l.photos && l.photos.length > 0 && <span>📷 {l.photos.length}</span>}
            </div>
          </div>
          <div className={s.myActions}>
            <button className={s.editBtn} onClick={() => setDetailListing(l)}>{T('mylistings.edit')}</button>
            <button className={s.deleteBtn} onClick={() => deleteListing(l.id)}>{T('mylistings.delete')}</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ProfilePage
export function ProfilePage() {
  const { T, currentUser, openAuth, logout, updateProfile } = useApp()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState(currentUser?.firstName || '')
  const [lastName, setLastName] = useState(currentUser?.lastName || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')

  useEffect(() => { if (!currentUser) openAuth('login') }, [currentUser])
  if (!currentUser) return null

  const save = () => {
    updateProfile({ firstName, lastName, phone })
  }

  return (
    <div className={s.page} style={{maxWidth:600}}>
      <h2>{T('profile.title')}</h2>
      <div className={s.section} style={{marginTop:20}}>
        <div className={s.profileAvRow}>
          <div className={s.profileAv}>{(firstName[0]||'')+(lastName[0]||'')}</div>
          <div><strong style={{fontSize:16}}>{firstName} {lastName}</strong><br /><span style={{color:'var(--muted)',fontSize:13}}>{currentUser.email}</span></div>
        </div>
        <div className={s.grid2}>
          <div className={s.fg}><label>{T('auth.firstName').replace(' *','')}</label><input className={s.fi} value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
          <div className={s.fg}><label>{T('auth.lastName').replace(' *','')}</label><input className={s.fi} value={lastName} onChange={e => setLastName(e.target.value)} /></div>
          <div className={s.fg}><label>Telefon</label><input className={s.fi} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+383 44 000 000" /></div>
          <div className={s.fg}><label>E-mail</label><input className={s.fi} value={currentUser.email} readOnly style={{background:'var(--cw)'}} /></div>
        </div>
        <div style={{textAlign:'right',marginTop:14}}>
          <button className={s.publishBtn} onClick={save}>{T('profile.save')}</button>
        </div>
      </div>
      <div className={s.section} style={{marginTop:14}}>
        <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>{T('profile.security')}</h3>
        <button className={s.editBtn} style={{width:'100%',justifyContent:'center',marginBottom:10}}>{T('profile.changePw')}</button>
        <button className={s.deleteBtn} style={{width:'100%',justifyContent:'center'}} onClick={() => { logout(); navigate('/') }}>{T('profile.logout')}</button>
      </div>
    </div>
  )
}

export default CreatePage
