'use client'
import { useEffect, useState } from 'react'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80'

function formatPrix(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function formatKm(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' km'
}

export default function CarModal({ voiture, onClose }) {
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [onClose])

  if (!voiture) return null

  const photos = voiture.photos?.length ? voiture.photos : [PLACEHOLDER]
  const vendu = voiture.statut === 'vendu'
  const pct = voiture.prix_barre
    ? Math.round((1 - voiture.prix / voiture.prix_barre) * 100)
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {voiture.marque} {voiture.modele}
            </h2>
            <p className="text-slate-500">{voiture.annee} · {formatKm(voiture.kilometrage)}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Photos */}
          <div>
            <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-100">
              <img
                src={photos[photoIdx]}
                alt={`${voiture.marque} ${voiture.modele}`}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = PLACEHOLDER }}
              />
              <div className="absolute top-3 left-3">
                <span className={vendu ? 'badge-vendu' : 'badge-disponible'}>
                  {vendu ? 'Vendu' : 'Disponible'}
                </span>
              </div>
              {pct && !vendu && (
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  -{pct}%
                </div>
              )}
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {photos.map((p, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)}>
                    <img
                      src={p}
                      className={`w-16 h-12 object-cover rounded-lg border-2 transition-all ${i === photoIdx ? 'border-blue-500 scale-105' : 'border-transparent'}`}
                      onError={e => { e.target.src = PLACEHOLDER }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prix */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500 font-medium mb-1">Prix</div>
              <div className="flex items-baseline gap-3">
                <span className={`text-3xl font-black ${vendu ? 'text-slate-400' : 'text-marine-700'}`}>
                  {formatPrix(voiture.prix)}
                </span>
                {voiture.prix_barre && (
                  <span className="text-slate-400 line-through text-base">
                    {formatPrix(voiture.prix_barre)}
                  </span>
                )}
              </div>
            </div>
            {pct && !vendu && (
              <div className="bg-red-100 text-red-700 font-black text-xl px-4 py-2 rounded-xl">
                -{pct}%
              </div>
            )}
          </div>

          {/* Caractéristiques */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Caractéristiques</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Carburant', value: voiture.carburant },
                { label: 'Transmission', value: voiture.transmission },
                { label: 'Kilométrage', value: formatKm(voiture.kilometrage) },
                { label: 'Année', value: voiture.annee },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 font-medium mb-1">{label}</div>
                  <div className="font-semibold text-slate-800">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {voiture.description && (
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">{voiture.description}</p>
            </div>
          )}

          {/* CTA */}
          {!vendu && (
            <a
              href="#contact"
              onClick={onClose}
              className="btn-primary w-full text-center block"
            >
              Je suis intéressé — Nous contacter
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
