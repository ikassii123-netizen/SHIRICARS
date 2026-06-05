'use client'
import { useState, useMemo } from 'react'
import CarCard from './CarCard'
import CarModal from './CarModal'

const FILTERS = [
  { key: 'all',        label: 'Tous les véhicules' },
  { key: 'disponible', label: 'Disponibles' },
  { key: 'vendu',      label: 'Vendus' },
]

export default function CatalogueClient({ voitures }) {
  const [filtre, setFiltre] = useState('all')
  const [recherche, setRecherche] = useState('')
  const [selectedVoiture, setSelectedVoiture] = useState(null)

  const resultats = useMemo(() => {
    return voitures.filter(v => {
      const matchFiltre = filtre === 'all' || v.statut === filtre
      const q = recherche.toLowerCase()
      const matchRecherche = !q ||
        v.marque.toLowerCase().includes(q) ||
        v.modele.toLowerCase().includes(q) ||
        v.carburant.toLowerCase().includes(q) ||
        String(v.annee).includes(q)
      return matchFiltre && matchRecherche
    })
  }, [voitures, filtre, recherche])

  const nbDispo  = voitures.filter(v => v.statut === 'disponible').length
  const nbVendus = voitures.filter(v => v.statut === 'vendu').length

  return (
    <>
      {/* Stats */}
      <section className="bg-marine-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { n: voitures.length, label: 'Véhicules au total' },
              { n: nbDispo,         label: 'Disponibles',        color: 'text-emerald-400' },
              { n: nbVendus,        label: 'Vendus',             color: 'text-slate-400' },
            ].map(({ n, label, color }) => (
              <div key={label}>
                <div className={`text-4xl font-black ${color || 'text-white'}`}>{n}</div>
                <div className="text-slate-400 text-sm font-medium mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Notre Catalogue</h2>
            <p className="section-subtitle">Des véhicules sélectionnés avec soin, à prix transparents</p>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFiltre(f.key)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  filtre === f.key
                    ? 'bg-marine-800 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="relative max-w-md mx-auto mb-10">
            <input
              type="text"
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              placeholder="Rechercher par marque, modèle, carburant..."
              className="input-field pl-12"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Grille */}
          {resultats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultats.map((v, i) => (
                <div key={v.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <CarCard voiture={v} onClick={setSelectedVoiture} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Aucun véhicule trouvé</p>
              <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedVoiture && (
        <CarModal voiture={selectedVoiture} onClose={() => setSelectedVoiture(null)} />
      )}
    </>
  )
}
