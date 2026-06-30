import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import AuthModal from './components/AuthModal'
import DetailModal from './components/DetailModal'
import FilterModal from './components/FilterModal'
import HomePage from './pages/HomePage'
import { CreatePage, MyListingsPage, ProfilePage } from './pages/FormPages'

export default function App() {
  return (
    <AppProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <AuthModal />
      <DetailModal />
      <FilterModal />
      <Toast />
    </AppProvider>
  )
}
