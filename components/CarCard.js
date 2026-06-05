import Image from 'next/image'

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
  const photo = voiture.photos?.[0] || PLACEHOLDER
  const pct = remise(voiture.prix_barre, voiture.prix)
  const vendu = voiture.statut === 'vendu'

  return (
    <article
      className={`card cursor-pointer group ${vendu ? 'opacity-75' : ''}`}
      onClick={() => onClick(voiture)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={photo}
          alt={`${voiture.marque} ${voiture.modele}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={vendu ? 'badge-vendu' : 'badge-disponible'}>
            {vendu ? 'Vendu' : 'Disponible'}
          </span>
        </div>
        {/* Remise badge */}
        {pct && !vendu && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{pct}%
          </div>
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
