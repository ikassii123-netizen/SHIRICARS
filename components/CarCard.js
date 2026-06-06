'use client'
import { useState } from 'react'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600&q=80'

function formatPrix(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function formatKm(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' km'
}

function remise(prixBarre, prix) {
  if (!prixBarre) return null
  return Math.round((1 - prix / prixBarre) * 100)
}

const CARBURANT_ICON = {
  'Essence': '⛽',
  'Diesel': '🛢️',
  'Hybride': '🔋',
  'Hybride Rechargeable': '🔌',
  'Électrique': '⚡',
}

export default function CarCard({ voiture, onClick }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const photos = voiture.photos?.length ? voiture.photos : [PLACEHOLDER]
  const pct = remise(voiture.prix_barre, voiture.prix)
  const vendu = voiture.statut === 'vendu'

  const prev = (e) => {
    e.stopPropagation()
    setPhotoIdx(i => (i - 1 + photos.length) % photos.length)
  }
  const next = (e) => {
    e.stopPropagation()
    setPhotoIdx(i => (i + 1) % photos.length)
  }

  return (
    <article
      className={`card cursor-pointer group ${vendu ? 'opacity-75' : ''}`}
      onClick={() => onClick(voiture)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={photos[photoIdx]}
          alt={`${voiture.marque} ${voiture.modele}`}
          className="w-full h-full object-cover transition-opacity duration-200"
          loading="lazy"
          onError={e => { e.target.src = PLACEHOLDER }}
        />

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={vendu ? 'badge-vendu' : 'badge-disponible'}>
            {vendu ? 'Vendu' : 'Disponible'}
          </span>
        </div>

        {/* Remise badge */}
        {pct && !vendu && (
          <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{pct}%
          </div>
        )}

        {/* Flechas (solo si hay más de 1 foto) */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white rounded-full transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90"
              aria-label="Photo précédente"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white rounded-full transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90"
              aria-label="Photo suivante"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setPhotoIdx(i) }}
                  className={`rounded-full transition-all duration-200 ${
                    i === photoIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {voiture.marque} {voiture.modele}
          </h3>
          <p className="text-slate-500 text-sm">{voiture.annee}</p>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
            {formatKm(voiture.kilometrage)}
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
            {CARBURANT_ICON[voiture.carburant] || '⛽'} {voiture.carburant}
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
            {voiture.transmission}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className={`text-2xl font-black ${vendu ? 'text-slate-400' : 'text-marine-700'}`}>
            {formatPrix(voiture.prix)}
          </span>
          {voiture.prix_barre && (
            <span className="text-slate-400 line-through text-sm font-medium">
              {formatPrix(voiture.prix_barre)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
