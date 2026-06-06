'use client'
import { useState } from 'react'
import { Fuel, Settings2, Gauge, Palette, Zap } from 'lucide-react'

const PistonIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="3" x2="5" y2="6" />
    <line x1="19" y1="3" x2="19" y2="6" />
    <rect x="4" y="6" width="16" height="8" rx="1" />
    <line x1="4" y1="10" x2="20" y2="10" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="12" y1="14" x2="12" y2="20" />
    <circle cx="12" cy="21" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600&q=80'

function formatPrix(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function formatKm(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' km'
}

function remise(prixBarre, prix) {
  if (!prixBarre || prixBarre === prix) return null
  return Math.round(((prix - prixBarre) / prixBarre) * 100)
}

const COULEUR_DOT = {
  'Blanc': '#F1F5F9', 'Noir': '#1E293B', 'Gris': '#94A3B8', 'Argent': '#CBD5E1',
  'Bleu': '#3B82F6', 'Rouge': '#EF4444', 'Vert': '#22C55E', 'Marron': '#92400E',
  'Beige': '#D4C5A9', 'Orange': '#F97316', 'Jaune': '#EAB308', 'Violet': '#8B5CF6',
}

export default function CarCard({ voiture, onClick }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const photos = voiture.photos?.length ? voiture.photos : [PLACEHOLDER]
  const pct = remise(voiture.prix_barre, voiture.prix)
  const vendu   = voiture.statut === 'vendu'
  const reserve = voiture.statut === 'reserve'
  const indispo = vendu || reserve

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
      className="card cursor-pointer group"
      onClick={() => onClick(voiture)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={photos[photoIdx]}
          alt={`${voiture.marque} ${voiture.modele}`}
          className={`w-full h-full object-cover transition-opacity duration-200 ${indispo ? 'brightness-75' : ''}`}
          loading="lazy"
          onError={e => { e.target.src = PLACEHOLDER }}
        />

        {/* Overlay diagonal VENDU / RÉSERVÉ */}
        {indispo && (
          <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
            <div className={`w-[140%] py-2.5 text-center font-black text-white text-base tracking-widest shadow-2xl transform rotate-[-28deg] ${
              vendu ? 'bg-red-600/90' : 'bg-amber-500/90'
            }`}>
              {vendu ? 'VENDU' : 'RÉSERVÉ'}
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={
            vendu   ? 'badge-vendu' :
            reserve ? 'badge-reserve' :
            'badge-disponible'
          }>
            {vendu ? 'Vendu' : reserve ? 'Réservé' : 'Disponible'}
          </span>
        </div>

        {/* Badge variation prix */}
        {pct && !indispo && (
          <div className={`absolute top-3 right-3 z-10 text-white text-xs font-bold px-2 py-1 rounded-lg ${pct < 0 ? 'bg-red-600' : 'bg-green-600'}`}>
            {pct > 0 ? `+${pct}%` : `${pct}%`}
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
      <div className={`p-4 ${vendu ? 'bg-slate-50' : ''}`}>
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {voiture.marque} {voiture.modele}
          </h3>
          <p className="text-slate-500 text-sm">{voiture.annee}</p>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { icon: <Gauge size={12} />, label: formatKm(voiture.kilometrage) },
            { icon: <Fuel size={12} />, label: voiture.carburant },
            { icon: <Settings2 size={12} />, label: voiture.transmission },
            voiture.puissance_cv ? { icon: voiture.carburant === 'Électrique' ? <Zap size={12} /> : <PistonIcon size={12} />, label: `${voiture.puissance_cv} CV` } : null,
            voiture.couleur ? { icon: <Palette size={12} />, label: voiture.couleur, dot: COULEUR_DOT[voiture.couleur] } : null,
          ].filter(Boolean).map(({ icon, label, dot }) => (
            <span key={label} className={`text-xs bg-slate-100 px-2 py-1 rounded-lg font-medium flex items-center gap-1.5 ${vendu ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="flex-shrink-0">{icon}</span>
              {dot && <span className="w-2 h-2 rounded-full border border-slate-300 flex-shrink-0" style={{ backgroundColor: dot }} />}
              {label}
            </span>
          ))}
        </div>

        {/* Price */}
        {!vendu && (
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-marine-700">
              {formatPrix(voiture.prix)}
            </span>
            {voiture.prix_barre && voiture.prix_barre !== voiture.prix && (
              <span className="text-slate-400 line-through text-sm font-medium">
                {formatPrix(voiture.prix_barre)}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
