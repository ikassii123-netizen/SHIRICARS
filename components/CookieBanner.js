'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookies_acceptes')) setVisible(true)
  }, [])

  function accepter() {
    localStorage.setItem('cookies_acceptes', '1')
    setVisible(false)
  }

  function refuser() {
    localStorage.setItem('cookies_acceptes', '0')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-marine-900 border-t border-marine-700 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-slate-300 flex-1">
          Nous utilisons des cookies essentiels au bon fonctionnement du site. En continuant, vous acceptez notre{' '}
          <Link href="/mentions-legales" className="text-blue-400 underline hover:text-blue-300">
            politique de confidentialité
          </Link>.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={refuser}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white border border-marine-600 rounded-lg transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accepter}
            className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
