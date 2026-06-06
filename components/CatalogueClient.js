'use client'
import { useState, useMemo } from 'react'
import CarCard from './CarCard'
import CarModal from './CarModal'

const STATUT_FILTERS = [
  { key: 'all',        label: 'Tous les véhicules' },
  { key: 'disponible', label: 'Disponibles' },
  { key: 'reserve',    label: 'Réservés' },
  { key: 'vendu',      label: 'Vendus' },
]

const CARBURANTS    = ['Essence', 'Diesel', 'Hybride', 'Hybride Rechargeable', 'Électrique']
const TRANSMISSIONS = ['Manuelle', 'Automatique', 'Semi-automatique']

const FILTRES_VIDES = {
  prixMin: '', prixMax: '',
  kmMin: '',   kmMax: '',
  anneeMin: '', anneeMax: '',
  carburants: [],
  transmissions: [],
  tri: 'recent',
}

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
}

export default function CatalogueClient({ voitures, whatsapp = '' }) {
  const [filtre, setFiltre]             = useState('all')
  const [recherche, setRecherche]       = useState('')
  const [selectedVoiture, setSelected]  = useState(null)
  const [avances, setAvances]           = useState(FILTRES_VIDES)
  const [panelOuvert, setPanelOuvert]   = useState(false)

  const set = (k, v) => setAvances(f => ({ ...f, [k]: v }))

  const nbActifs = useMemo(() => {
    let n = 0
    if (avances.prixMin)              n++
    if (avances.prixMax)              n++
    if (avances.kmMin)                n++
    if (avances.kmMax)                n++
    if (avances.anneeMin)             n++
    if (avances.anneeMax)             n++
    if (avances.carburants.length)    n++
    if (avances.transmissions.length) n++
    return n
  }, [avances])

  const resultats = useMemo(() => {
    let list = voitures.filter(v => {
      if (filtre !== 'all' && v.statut !== filtre) return false
      const q = recherche.toLowerCase()
      if (q && !v.marque.toLowerCase().includes(q) && !v.modele.toLowerCase().includes(q) &&
          !v.carburant.toLowerCase().includes(q) && !String(v.annee).includes(q)) return false
      if (avances.prixMin && v.prix < Number(avances.prixMin)) return false
      if (avances.prixMax && v.prix > Number(avances.prixMax)) return false
      if (avances.kmMin   && v.kilometrage < Number(avances.kmMin))   return false
      if (avances.kmMax   && v.kilometrage > Number(avances.kmMax))   return false
      if (avances.anneeMin && v.annee < Number(avances.anneeMin)) return false
      if (avances.anneeMax && v.annee > Number(avances.anneeMax)) return false
      if (avances.carburants.length    && !avances.carburants.includes(v.carburant))       return false
      if (avances.transmissions.length && !avances.transmissions.includes(v.transmission)) return false
      return true
    })

    if (avances.tri === 'prix_asc')  list = [...list].sort((a, b) => a.prix - b.prix)
    if (avances.tri === 'prix_desc') list = [...list].sort((a, b) => b.prix - a.prix)
    if (avances.tri === 'km_asc')    list = [...list].sort((a, b) => a.kilometrage - b.kilometrage)
    if (avances.tri === 'annee_desc')list = [...list].sort((a, b) => b.annee - a.annee)

    return list
  }, [voitures, filtre, recherche, avances])

  const nbDispo    = voitures.filter(v => v.statut === 'disponible').length
  const nbReserves = voitures.filter(v => v.statut === 'reserve').length
  const nbVendus   = voitures.filter(v => v.statut === 'vendu').length

  return (
    <>
      {/* Stats */}
      <section className="bg-marine-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { n: voitures.length, label: 'Total' },
              { n: nbDispo,         label: 'Disponibles',  color: 'text-emerald-400' },
              { n: nbReserves,      label: 'Réservés',     color: 'text-amber-400' },
              { n: nbVendus,        label: 'Vendus',       color: 'text-slate-400' },
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

          {/* Filtres statut */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {STATUT_FILTERS.map(f => (
              <button key={f.key} onClick={() => setFiltre(f.key)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  filtre === f.key
                    ? 'bg-marine-800 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Barre recherche + filtres avancés */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-4">
            <div className="relative flex-1">
              <input type="text" value={recherche} onChange={e => setRecherche(e.target.value)}
                placeholder="Rechercher par marque, modèle..."
                className="input-field pl-12 w-full" />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button onClick={() => setPanelOuvert(o => !o)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border transition-all ${
                panelOuvert || nbActifs > 0
                  ? 'bg-marine-800 text-white border-marine-800'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filtres
              {nbActifs > 0 && (
                <span className="bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {nbActifs}
                </span>
              )}
            </button>
          </div>

          {/* Panel filtres avancés */}
          {panelOuvert && (
            <div className="max-w-2xl mx-auto mb-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">

              {/* Tri */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Trier par</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'recent',    label: 'Plus récent' },
                    { val: 'prix_asc',  label: 'Prix ↑' },
                    { val: 'prix_desc', label: 'Prix ↓' },
                    { val: 'km_asc',    label: 'Km ↑' },
                    { val: 'annee_desc',label: 'Année ↓' },
                  ].map(({ val, label }) => (
                    <button key={val} onClick={() => set('tri', val)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        avances.tri === val
                          ? 'bg-marine-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Prix (€)</label>
                <div className="flex gap-3">
                  <input type="number" min="0" placeholder="Min" value={avances.prixMin}
                    onChange={e => set('prixMin', e.target.value)}
                    className="input-field flex-1 text-sm" />
                  <input type="number" min="0" placeholder="Max" value={avances.prixMax}
                    onChange={e => set('prixMax', e.target.value)}
                    className="input-field flex-1 text-sm" />
                </div>
              </div>

              {/* Kilométrage */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Kilométrage</label>
                <div className="flex gap-3">
                  <input type="number" min="0" placeholder="Min km" value={avances.kmMin}
                    onChange={e => set('kmMin', e.target.value)}
                    className="input-field flex-1 text-sm" />
                  <input type="number" min="0" placeholder="Max km" value={avances.kmMax}
                    onChange={e => set('kmMax', e.target.value)}
                    className="input-field flex-1 text-sm" />
                </div>
              </div>

              {/* Année */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Année</label>
                <div className="flex gap-3">
                  <input type="number" min="1990" max={new Date().getFullYear()} placeholder="De" value={avances.anneeMin}
                    onChange={e => set('anneeMin', e.target.value)}
                    className="input-field flex-1 text-sm" />
                  <input type="number" min="1990" max={new Date().getFullYear()} placeholder="À" value={avances.anneeMax}
                    onChange={e => set('anneeMax', e.target.value)}
                    className="input-field flex-1 text-sm" />
                </div>
              </div>

              {/* Carburant */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Carburant</label>
                <div className="flex flex-wrap gap-2">
                  {CARBURANTS.map(c => (
                    <button key={c} onClick={() => set('carburants', toggle(avances.carburants, c))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        avances.carburants.includes(c)
                          ? 'bg-marine-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Transmission</label>
                <div className="flex gap-2">
                  {TRANSMISSIONS.map(t => (
                    <button key={t} onClick={() => set('transmissions', toggle(avances.transmissions, t))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        avances.transmissions.includes(t)
                          ? 'bg-marine-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {nbActifs > 0 && (
                <button onClick={() => setAvances(FILTRES_VIDES)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Réinitialiser les filtres ({nbActifs})
                </button>
              )}
            </div>
          )}

          {/* Résultat count */}
          {(nbActifs > 0 || recherche) && (
            <p className="text-center text-sm text-slate-500 mb-6">
              {resultats.length} véhicule{resultats.length !== 1 ? 's' : ''} trouvé{resultats.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Grille */}
          {resultats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultats.map((v, i) => (
                <div key={v.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <CarCard voiture={v} onClick={setSelected} />
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
              {nbActifs > 0 && (
                <button onClick={() => setAvances(FILTRES_VIDES)} className="mt-4 text-sm text-blue-600 hover:underline">
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedVoiture && (
        <CarModal
          voiture={selectedVoiture}
          onClose={() => setSelected(null)}
          whatsapp={whatsapp}
          onFilterDisponible={() => { setFiltre('disponible'); setSelected(null) }}
        />
      )}
    </>
  )
}
