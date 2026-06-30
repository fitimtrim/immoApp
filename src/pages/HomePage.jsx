import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import s from './HomePage.module.css'
import LocationSearch from '../components/LocationSearch'

const CITIES = [
  { name:'Prishtinë', key:'2.861', color:'#ff6b35' },
  { name:'Prizren',   key:'1.246', color:'#e55a2b' },
  { name:'Pejë',      key:'732',   color:'#c44b22' },
  { name:'Gjilan',    key:'512',   color:'#a33c1a' },
  { name:'Ferizaj',   key:'466',   color:'#8a2e12' },
]

export default function HomePage() {
  const { T, allListings, showToast, setDetailListing, setFilterOpen } = useApp()
  const navigate = useNavigate()
  const [offerTab, setOfferTab] = useState('tab1')
  const [location, setLocation] = useState('')
  const [propType, setPropType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [email, setEmail] = useState('')

  const doSearch = () => {
    showToast(T('toast.searching'), 'success')
    setShowDrop(false)
  }

  const trending = allListings.slice(0, 4)

  const features = [
    { icon:'🔍', title: T('feat.search'), desc: T('feat.search.desc') },
    { icon:'🤝', title: T('feat.compare'), desc: T('feat.compare.desc') },
    { icon:'📞', title: T('feat.contact'), desc: T('feat.contact.desc') },
    { icon:'✨', title: T('feat.perfect'), desc: T('feat.perfect.desc') },
  ]

  return (
    <div className={s.page}>

      {/* ══ HERO ══ */}
      <section className={s.hero}>
        <div className={s.heroLeft}>
          <p className={s.heroEyebrow}>{T('hero.eyebrow')}</p>
          <h1 className={s.heroTitle}>
            {T('hero.title')}<br/>{T('hero.title2')}
          </h1>
          <p className={s.heroSub}>
            {T('hero.sub1')}<br/>{T('hero.sub2')}
          </p>
          <button className={s.heroCta}
            onClick={() => document.getElementById('search-section').scrollIntoView({behavior:'smooth'})}>
            {T('hero.cta')}
          </button>
        </div>
        <div className={s.heroRight}>
          <div className={s.heroImgWrap}>
            <div className={s.heroImgInner}>
              <svg viewBox="0 0 400 340" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect width="400" height="340" fill="#f5ede3" rx="20"/>
                <rect x="0" y="0" width="400" height="220" fill="#f0e6d8"/>
                <rect x="0" y="220" width="400" height="120" fill="#e8d5bc"/>
                <ellipse cx="290" cy="110" rx="80" ry="100" fill="#e8dcd0"/>
                <rect x="230" y="20" width="140" height="180" rx="8" fill="#d4e8f0" opacity=".6"/>
                <line x1="300" y1="20" x2="300" y2="200" stroke="#fff" strokeWidth="3" opacity=".5"/>
                <line x1="230" y1="110" x2="370" y2="110" stroke="#fff" strokeWidth="3" opacity=".5"/>
                <circle cx="350" cy="170" r="20" fill="#8fbc8f" opacity=".7"/>
                <rect x="345" y="185" width="10" height="15" fill="#8B6914"/>
                <rect x="40" y="190" width="200" height="70" rx="12" fill="#d4a882"/>
                <rect x="40" y="190" width="200" height="20" rx="8" fill="#c8956a"/>
                <rect x="40" y="200" width="15" height="55" rx="6" fill="#c8956a"/>
                <rect x="225" y="200" width="15" height="55" rx="6" fill="#c8956a"/>
                <rect x="65" y="195" width="55" height="45" rx="8" fill="#e8c4a0"/>
                <rect x="130" y="195" width="55" height="45" rx="8" fill="#dbb896"/>
                <ellipse cx="170" cy="285" rx="70" ry="25" fill="#c4a882"/>
                <ellipse cx="170" cy="280" rx="65" ry="18" fill="#d4b896"/>
                <circle cx="170" cy="262" r="12" fill="#7ab87a" opacity=".8"/>
                <rect x="28" y="80" width="4" height="100" fill="#b8956a"/>
                <ellipse cx="30" cy="78" rx="22" ry="12" fill="#f0c878" opacity=".9"/>
                <rect x="100" y="40" width="55" height="70" rx="4" fill="#fff" opacity=".6"/>
              </svg>
            </div>
            <div className={s.heroBadgeFloat}>
              <span className={s.heroBadgeIcon}>🏠</span>
              <div>
                <div className={s.heroBadgeNum}>{T('hero.badge.num')}</div>
                <div className={s.heroBadgeLbl}>{T('hero.badge.lbl')}</div>
              </div>
            </div>
            <div className={s.heroBadgeFloat2}>
              <span>{T('hero.badge2')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SEARCH ══ */}
      <section className={s.searchSection} id="search-section">
        <div className={s.searchCard}>
          {/* Tabs */}
          <div className={s.searchTabs}>
            {['tab1','tab2','tab3'].map(tab => (
              <button key={tab}
                className={`${s.searchTab} ${offerTab===tab ? s.searchTabActive : ''}`}
                onClick={() => setOfferTab(tab)}>
                {T(`search.${tab}`)}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className={s.searchRow}>
            {/* Location */}
            <div className={s.searchFieldWrap}>
              <label className={s.searchLabel}>{T('search.loc.label')}</label>
              <LocationSearch
                value={location}
                onChange={setLocation}
                placeholder={T('search.loc.ph')}
              />
            </div>

            {/* Type */}
            <div className={s.searchFieldWrap}>
              <label className={s.searchLabel}>{T('search.type.label')}</label>
              <div className={s.searchField}>
                <select className={s.searchSel} value={propType} onChange={e => setPropType(e.target.value)}>
                  <option value="">{T('search.type.all')}</option>
                  <option>{T('search.type.opt1')}</option>
                  <option>{T('search.type.opt2')}</option>
                  <option>{T('search.type.opt3')}</option>
                  <option>{T('search.type.opt4')}</option>
                  <option>{T('search.type.opt5')}</option>
                  <option>{T('search.type.opt6')}</option>
                </select>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" style={{flexShrink:0,pointerEvents:'none'}}><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>

            {/* Price */}
            <div className={s.searchFieldWrap}>
              <label className={s.searchLabel}>{T('search.price.label')}</label>
              <div className={s.searchField}>
                <select className={s.searchSel} value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                  <option value="">{T('search.price.ph')}</option>
                  <option>{T('search.price.opt1')}</option>
                  <option>{T('search.price.opt2')}</option>
                  <option>{T('search.price.opt3')}</option>
                  <option>{T('search.price.opt4')}</option>
                  <option>{T('search.price.opt5')}</option>
                  <option>{T('search.price.opt6')}</option>
                </select>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" style={{flexShrink:0,pointerEvents:'none'}}><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>

            {/* Search btn */}
            <button className={s.searchBtn} onClick={doSearch}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
              {T('search.btn')}
            </button>
          </div>


        </div>
      </section>

      {/* ══ STATS ══ */}
      <div className={s.stats}>
        <div className={s.statItem}><div className={s.statNum}>10.432</div><div className={s.statLbl}>{T('stats.listings')}</div></div>
        <div className={s.statItem}><div className={s.statNum}>847</div><div className={s.statLbl}>{T('stats.new')}</div></div>
        <div className={s.statItem}><div className={s.statNum}>98%</div><div className={s.statLbl}>{T('stats.verified')}</div></div>
        <div className={s.statItem}><div className={s.statNum}>4.8 ★</div><div className={s.statLbl}>{T('stats.rating')}</div></div>
      </div>

      {/* ══ CITIES ══ */}
      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>{T('cities.title')}</h2>
          <a className={s.sectionLink} href="#">{T('cities.all')}</a>
        </div>
        <div className={s.citiesGrid}>
          {CITIES.map((c, i) => (
            <div key={i} className={s.cityCard} onClick={doSearch}>
              <div className={s.cityImg} style={{background:`linear-gradient(135deg, ${c.color}cc, ${c.color}88)`}}>
                <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className={s.citySkyline}>
                  <rect x="10" y="40" width="20" height="40" fill="rgba(255,255,255,0.15)" rx="2"/>
                  <rect x="35" y="25" width="15" height="55" fill="rgba(255,255,255,0.2)" rx="2"/>
                  <rect x="55" y="15" width="25" height="65" fill="rgba(255,255,255,0.15)" rx="2"/>
                  <rect x="85" y="30" width="18" height="50" fill="rgba(255,255,255,0.18)" rx="2"/>
                  <rect x="108" y="20" width="22" height="60" fill="rgba(255,255,255,0.2)" rx="2"/>
                  <rect x="135" y="35" width="16" height="45" fill="rgba(255,255,255,0.15)" rx="2"/>
                  <rect x="156" y="28" width="20" height="52" fill="rgba(255,255,255,0.18)" rx="2"/>
                </svg>
                <div className={s.cityName2}>{c.name}</div>
              </div>
              <div className={s.cityInfo}>
                <div className={s.cityName}>{c.name}</div>
                <div className={s.cityCount}>{c.key} {T('city.count')}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TRENDING ══ */}
      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>{T('trend.title')}</h2>
          <a className={s.sectionLink} href="#">{T('trend.all')}</a>
        </div>
        <div className={s.trendGrid}>
          {trending.map(l => (
            <div key={l.id} className={s.trendCard} onClick={() => setDetailListing(l)}>
              <div className={s.trendImg}>
                {l.photos && l.photos.length > 0
                  ? <img src={l.photos[0]} alt={l.title}/>
                  : <div className={s.trendImgPh}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    </div>
                }
                {l.badge==='featured' && <span className={s.trendBadgeFeat}>{T('search.tab1')}</span>}
                {l.badge==='new' && <span className={s.trendBadgeNew}>{T('search.tab2')}</span>}
                <button className={s.trendFav} onClick={e => e.stopPropagation()}>♡</button>
              </div>
              <div className={s.trendBody}>
                <div className={s.trendTitle}>{l.title}</div>
                <div className={s.trendLoc}>📍 {l.loc}</div>
                <div className={s.trendPrice}>{l.price}</div>
                <div className={s.trendStats}>
                  <span>🛏 {l.rooms}</span>
                  <span>📐 {l.area}</span>
                  {l.floor && <span>🏢 {l.floor}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className={s.featuresSection}>
        <div className={s.featuresGrid}>
          {features.map((f,i) => (
            <div key={i} className={s.featureItem}>
              <div className={s.featureIcon}>{f.icon}</div>
              <div className={s.featureTitle}>{f.title}</div>
              <div className={s.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section className={s.newsletter}>
        <div className={s.newsletterInner}>
          <div>
            <h3 className={s.newsletterTitle}>{T('newsletter.title')}</h3>
            <p className={s.newsletterSub}>{T('newsletter.sub')}</p>
          </div>
          <div className={s.newsletterForm}>
            <input className={s.newsletterInput} type="email"
              placeholder={T('newsletter.ph')}
              value={email} onChange={e => setEmail(e.target.value)}/>
            <button className={s.newsletterBtn}
              onClick={() => { showToast('✓ ' + T('toast.registered'), 'success'); setEmail('') }}>
              {T('newsletter.btn')}
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className={s.footer}>
        <div className={s.footerGrid}>
          <div>
            <div className={s.footerLogo}>
              <img src="/logo.svg" alt="ViaHome24" style={{width:44,height:38,objectFit:'contain',filter:'brightness(1.1)'}}/>
              <div>
                <div style={{fontFamily:"var(--font)",fontSize:20,fontWeight:800,color:"#fff",lineHeight:1}}>
                  Via<span style={{color:"#ff6b35"}}>Home</span>24
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:3}}>Gjej pronën tënde ideale</div>
              </div>
            </div>
            <p className={s.footerDesc}>{T('footer.desc')}</p>
          </div>
          <div>
            <h5 className={s.footerHeading}>{T('footer.quick')}</h5>
            <ul className={s.footerList}>
              <li><a href="#">{T('footer.home')}</a></li>
              <li><a href="#">{T('footer.listings')}</a></li>
              <li><a href="#">{T('footer.agents')}</a></li>
              <li><a href="#">{T('footer.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h5 className={s.footerHeading}>{T('footer.support')}</h5>
            <ul className={s.footerList}>
              <li><a href="#">{T('footer.faq')}</a></li>
              <li><a href="#">{T('footer.terms')}</a></li>
              <li><a href="#">{T('footer.privacy')}</a></li>
              <li><a href="#">{T('footer.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h5 className={s.footerHeading}>{T('footer.follow')}</h5>
            <div className={s.footerSocials}>
              <a className={s.socialBtn} href="#">f</a>
              <a className={s.socialBtn} href="#">ig</a>
              <a className={s.socialBtn} href="#">yt</a>
            </div>
          </div>
        </div>
        <div className={s.footerBottom}>
          <p>{T('footer.copy')}</p>
        </div>
      </footer>
    </div>
  )
}
