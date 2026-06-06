export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

async function getParametres() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { fetch: (url, opts = {}) => fetch(url, { ...opts, cache: 'no-store' }) } }
  )
  const { data } = await supabase.from('parametres').select('cle, valeur')
  if (!data?.length) return {}
  return Object.fromEntries(data.map(r => [r.cle, r.valeur]))
}

export async function generateMetadata() {
  const p = await getParametres()
  const nom = p.nom_entreprise || 'SY CAR'
  return {
    title: `Qui sommes-nous — ${nom}`,
    description: `Découvrez ${nom}, votre spécialiste de la vente de véhicules d'occasion. Transparence et confiance au cœur de chaque vente.`,
  }
}

export default async function APropos() {
  const p = await getParametres()

  const nom       = p.nom_entreprise || 'SY CAR'
  const slogan    = p.slogan         || 'La confiance, avant tout'
  const adresse   = p.adresse        || ''
  const horaires  = p.horaires       || 'Lundi – Samedi : 9h00 – 19h00'
  const telephone = p.telephone      || ''
  const mapsEmbed = p.maps_embed     || (adresse ? `https://maps.google.com/maps?q=${encodeURIComponent(adresse)}&output=embed&z=15` : null)
  const mapsLien  = p.maps_lien      || (adresse ? `https://maps.google.com/maps?q=${encodeURIComponent(adresse)}` : null)
  const initiales = nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-marine-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-slate-400 hover:text-white text-sm mb-6 inline-block transition-colors">
            ← Retour à l&apos;accueil
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center font-black text-white text-xl">
              {initiales}
            </div>
            <div>
              <h1 className="text-3xl font-black">Qui sommes-nous ?</h1>
              <p className="text-slate-400 mt-1">{nom} — {slogan}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">

        {/* Notre histoire */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Notre histoire</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>{nom}</strong> est un commerce de vente de véhicules d&apos;occasion.
              Nous mettons un point d&apos;honneur à proposer des voitures soigneusement
              sélectionnées, vérifiées et présentées à des prix transparents — qu&apos;elles
              soient françaises ou importées.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Notre priorité : vous offrir une expérience d&apos;achat simple, honnête et sans
              mauvaise surprise. Chaque véhicule de notre catalogue a été inspecté et est
              présenté avec toutes ses caractéristiques réelles.
            </p>
          </div>
          <div className="bg-marine-900 rounded-3xl p-8 text-white text-center">
            <div className="text-5xl font-black text-red-500 mb-2">100%</div>
            <div className="text-slate-300 font-medium">Véhicules vérifiés</div>
            <div className="border-t border-marine-700 my-6" />
            <div className="text-3xl font-black text-white mb-2">&ldquo;</div>
            <div className="text-slate-300 font-medium italic">{slogan}</div>
          </div>
        </section>

        {/* Nos engagements */}
        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Nos engagements</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: '🔍',
                titre: 'Sélection rigoureuse',
                texte: 'Chaque véhicule est inspecté avant d\'être mis en vente. Nous ne proposons que des voitures en bon état.'
              },
              {
                icon: '💶',
                titre: 'Prix transparents',
                texte: 'Pas de frais cachés. Le prix affiché est le prix final. Les remises sont clairement indiquées.'
              },
              {
                icon: '🤝',
                titre: 'Accompagnement personnalisé',
                texte: 'Notre équipe vous accompagne de la première question jusqu\'à la remise des clés.'
              },
            ].map(({ icon, titre, texte }) => (
              <div key={titre} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{titre}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{texte}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Localisation */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Nous trouver</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                adresse   && { icon: '📍', label: 'Adresse',   val: adresse },
                horaires  && { icon: '🕐', label: 'Horaires',  val: horaires },
                telephone && { icon: '📞', label: 'Téléphone', val: telephone },
              ].filter(Boolean).map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</div>
                    <div className="text-slate-700 font-medium">{val}</div>
                  </div>
                </div>
              ))}

              {mapsLien && (
                <a
                  href={mapsLien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Voir l&apos;itinéraire sur Google Maps
                </a>
              )}
            </div>

            {mapsEmbed && (
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title={`Localisation ${nom}`}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapsEmbed}
                />
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Prêt à trouver votre prochain véhicule ?</h2>
          <p className="text-slate-500 mb-6">Consultez notre catalogue ou contactez-nous directement.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#catalogue" className="btn-primary">Voir le catalogue</Link>
            <Link href="/#contact" className="btn-secondary">Nous contacter</Link>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} {nom} — Tous droits réservés ·{' '}
        <Link href="/mentions-legales" className="hover:text-slate-600 underline">Mentions légales</Link>
      </div>
    </div>
  )
}
