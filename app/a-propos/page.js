export const dynamic = 'force-dynamic'

import Link from 'next/link'

export const metadata = {
  title: 'Qui sommes-nous — SHIRI CARS',
  description: 'Découvrez SHIRI CARS, votre concessionnaire de véhicules d\'occasion à Arras, dans le nord de la France.',
}

export default function APropos() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-marine-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-slate-400 hover:text-white text-sm mb-6 inline-block transition-colors">
            ← Retour à l&apos;accueil
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center font-black text-white text-xl">SC</div>
            <div>
              <h1 className="text-3xl font-black">Qui sommes-nous ?</h1>
              <p className="text-slate-400 mt-1">SHIRI CARS — Arras, Hauts-de-France</p>
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
              SHIRI CARS est un commerce de vente de véhicules d&apos;occasion implanté à <strong>Arras</strong>,
              au cœur des Hauts-de-France. Nous mettons un point d&apos;honneur à proposer des voitures
              soigneusement sélectionnées, vérifiées et proposées à des prix transparents.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Notre priorité : vous offrir une expérience d&apos;achat simple, honnête et sans mauvaise surprise.
              Chaque véhicule de notre catalogue a été inspecté et est présenté avec toutes ses caractéristiques.
            </p>
          </div>
          <div className="bg-marine-900 rounded-3xl p-8 text-white text-center">
            <div className="text-5xl font-black text-red-500 mb-2">100%</div>
            <div className="text-slate-300 font-medium">Véhicules vérifiés</div>
            <div className="border-t border-marine-700 my-6" />
            <div className="text-5xl font-black text-white mb-2">📍</div>
            <div className="text-slate-300 font-medium">Arras, Hauts-de-France</div>
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
                { icon: '📍', label: 'Adresse', val: 'Arras, Hauts-de-France (62)' },
                { icon: '🕐', label: 'Horaires', val: 'Lundi – Samedi : 9h00 – 19h00' },
                { icon: '📞', label: 'Téléphone', val: 'Disponible via le formulaire de contact' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</div>
                    <div className="text-slate-700 font-medium">{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <iframe
                title="Localisation SHIRI CARS — Arras"
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://maps.google.com/maps?q=Arras+France&output=embed&z=13"
              />
            </div>
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
        © {new Date().getFullYear()} SHIRI CARS — Tous droits réservés ·{' '}
        <Link href="/mentions-legales" className="hover:text-slate-600 underline">Mentions légales</Link>
      </div>
    </div>
  )
}
