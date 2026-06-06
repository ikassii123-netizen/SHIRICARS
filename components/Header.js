'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-marine-900 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-sm group-hover:bg-red-500 transition-colors">
              SC
            </div>
            <div className="leading-tight">
              <div className="font-black text-lg tracking-wide">SHIRI CARS</div>
              <div className="text-xs text-slate-400 font-medium">Véhicules Français</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#catalogue" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">
              Catalogue
            </a>
            <Link href="/a-propos" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">
              Qui sommes-nous
            </Link>
            <a href="#contact" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">
              Contact
            </a>
            <Link
              href="/admin"
              className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Administration
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700 mt-2 pt-4 space-y-3">
            <a href="#catalogue" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white font-medium">Catalogue</a>
            <Link href="/a-propos" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white font-medium">Qui sommes-nous</Link>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white font-medium">Contact</a>
            <Link href="/admin" className="block bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-center">Administration</Link>
          </div>
        )}
      </div>
    </header>
  )
}
