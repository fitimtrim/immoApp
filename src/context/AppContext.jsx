import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { TRANSLATIONS } from '../data/translations'
import { SAMPLE_LISTINGS } from '../data/locations'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

function loadStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : fallback
  } catch { return fallback }
}
function saveStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export function AppProvider({ children }) {
  const [lang, setLangState] = useState(() => loadStorage('vh24_lang', 'sq'))

  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [userListings, setUserListingsState] = useState([])
  const [listingsLoading, setListingsLoading] = useState(true)

  const [toast, setToast] = useState({ msg: '', type: '', visible: false })
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState('login')
  const [detailListing, setDetailListing] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})

  const T = useCallback((key) => {
    return (TRANSLATIONS[lang] || TRANSLATIONS.sq)[key] || key
  }, [lang])

  const setLang = (l) => {
    setLangState(l)
    saveStorage('vh24_lang', l)
  }

  let toastTimer = null
  const showToast = (msg, type = '') => {
    setToast({ msg, type, visible: true })
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800)
  }

  const openAuth = (tab = 'login') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }
  const closeAuth = () => setAuthOpen(false)

  // ── Load session + profile, listen for auth changes ──
  useEffect(() => {
    const loadUser = async (session) => {
      if (!session?.user) {
        setCurrentUser(null)
        setAuthLoading(false)
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setCurrentUser({
        id: session.user.id,
        email: session.user.email,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        phone: profile?.phone || '',
      })
      setAuthLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => loadUser(session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // ── Load listings from Supabase ──
  const fetchListings = useCallback(async () => {
    setListingsLoading(true)
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const mapped = data.map(l => ({
        id: l.id,
        title: l.title,
        type: l.type,
        offerType: l.offer_type,
        loc: l.loc,
        price: `€ ${Number(l.price).toLocaleString('de-CH')}`,
        priceLabel: l.price_label,
        rooms: l.rooms,
        area: l.area,
        floor: l.floor,
        year: l.year,
        desc: l.description,
        features: l.features || [],
        photos: l.photos || [],
        badge: l.badge,
        agent: l.agent_name,
        userId: l.user_id,
      }))
      setUserListingsState(mapped)
    }
    setListingsLoading(false)
  }, [])

  useEffect(() => { fetchListings() }, [fetchListings])

  // ── AUTH ──────────────────────────────────────────
  const doLogin = async (email, pw) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) {
      if (error.message.includes('Invalid login credentials')) return T('auth.err.notfound')
      return error.message
    }
    closeAuth()
    showToast(T('toast.loggedIn'), 'success')
    return null
  }

  const doRegister = async ({ firstName, lastName, email, pw, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        data: { first_name: firstName, last_name: lastName, phone: phone || '' }
      }
    })
    if (error) {
      if (error.message.includes('already registered')) return T('auth.err.exists')
      return error.message
    }
    closeAuth()
    if (data.session) {
      showToast(T('toast.registered'), 'success')
    } else {
      showToast('✓ Kontrolloni email-in për konfirmim!', 'success')
    }
    return null
  }

  const logout = async () => {
    await supabase.auth.signOut()
    showToast(T('toast.loggedOut'))
  }

  const updateProfile = async (updates) => {
    if (!currentUser) return
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
      })
      .eq('id', currentUser.id)

    if (!error) {
      setCurrentUser(prev => ({ ...prev, ...updates }))
      showToast(T('toast.saved'), 'success')
    } else {
      showToast(error.message, 'error')
    }
  }

  // ── LISTINGS ──────────────────────────────────────
  const allListings = [...SAMPLE_LISTINGS, ...userListings]

  const uploadPhotos = async (files) => {
    const urls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${currentUser.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('listing-photos').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('listing-photos').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  const addListing = async (listing, photoFiles = []) => {
    if (!currentUser) { openAuth('login'); return { message: 'Not logged in' } }

    let photoUrls = []
    if (photoFiles.length > 0) {
      photoUrls = await uploadPhotos(photoFiles)
    }

    const { error } = await supabase.from('listings').insert({
      user_id: currentUser.id,
      title: listing.title,
      type: listing.type,
      offer_type: listing.offerType,
      loc: listing.loc,
      price: listing.priceNum,
      price_label: listing.priceLabel,
      rooms: listing.rooms,
      area: listing.area,
      floor: listing.floor,
      year: listing.year,
      description: listing.desc,
      features: listing.features,
      photos: photoUrls,
      badge: 'new',
      agent_name: `${currentUser.firstName} ${currentUser.lastName}`,
    })

    if (!error) {
      showToast(T('toast.published'), 'success')
      fetchListings()
    } else {
      showToast(error.message, 'error')
    }
    return error
  }

  const deleteListing = async (id) => {
    const { error } = await supabase.from('listings').delete().eq('id', id)
    if (!error) {
      setUserListingsState(prev => prev.filter(l => l.id !== id))
      showToast(T('toast.deleted'))
    } else {
      showToast(error.message, 'error')
    }
  }

  return (
    <AppContext.Provider value={{
      lang, setLang, T,
      currentUser, authLoading, doLogin, doRegister, logout, updateProfile,
      allListings, userListings, addListing, deleteListing, listingsLoading, fetchListings,
      toast, showToast,
      authOpen, authTab, openAuth, closeAuth, setAuthTab,
      detailListing, setDetailListing,
      filterOpen, setFilterOpen,
      activeFilters, setActiveFilters,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
