export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Header from '../components/Header'
import CatalogueClient from '../components/CatalogueClient'
import ContactForm from '../components/ContactForm'

async function getVoitures() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { fetch: (url, opts = {}) => fetch(url, { ...opts, cache: 'no-store' }) } }
  )
  const { data, error } = await supabase
    .from('voitures')
    .select('*')
    .order('date_ajout', { ascending: false })

  if (error) {
    console.error('Erreur chargement voitures:', error)
    return []
  }
  return data || []
}

async function getParametres() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { fetch: (url, opts = {}) => fetch(url, { ...opts, cache: 'no-store' }) } }
  )
  const { data } = await supabase
    .from('parametres')
    .select('cle, valeur')
    .in('cle', ['nom_entreprise', 'slogan'])
  if (!data?.length) return {}
  return Object.fromEntries(data.map(r => [r.cle, r.valeur]))
}

export default async function HomePage() {
  const [voitures, params] = await Promise.all([getVoitures(), getParametres()])
  const nomEntreprise = params.nom_entreprise || 'SY CAR'
  const slogan = params.slogan || 'La confiance, avant tout'

  return (
    <div className="min-h-screen">
      <Header nomEntreprise={nomEntreprise} slogan={slogan} />

      {/* Hero */}
      <section className="bg-marine-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 bg-marine-700 text-slate-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🚗 Votre spécialiste de la vente automobile
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            Trouvez Votre<br />
            <span className="text-red-400">Voiture Idéale</span>
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-10">
            Des véhicules français sélectionnés avec soin, des prix transparents et un service de confiance depuis des années.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#catalogue" className="btn-primary text-base px-8 py-4">
              Voir le Catalogue
            </a>
            <a href="#contact" className="btn-secondary text-base px-8 py-4 bg-transparent text-white border-slate-600 hover:bg-marine-700">
              Nous Contacter
            </a>
          </div>
        </div>
      </section>

      {/* Catalogue + Stats (Client Component pour filtres interactifs) */}
      <CatalogueClient voitures={voitures} />

      {/* Contact */}
      <ContactForm />

      {/* Footer */}
      <footer className="bg-marine-900 border-t border-marine-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <div className="font-semibold text-white">{nomEntreprise}</div>
          <p>© {new Date().getFullYear()} {nomEntreprise} — Tous droits réservés</p>
          <div className="flex gap-4">
            <Link href="/a-propos" className="hover:text-white transition-colors">Qui sommes-nous</Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
