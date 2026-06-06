export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export const metadata = {
  title: 'Mentions Légales & Politique de Confidentialité — SHIRI CARS',
}

async function getInfos() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data } = await supabase
    .from('parametres')
    .select('cle, valeur')
    .in('cle', ['nom_entreprise', 'adresse', 'email', 'siret', 'tva', 'directeur_publication'])
  if (!data?.length) return {}
  return Object.fromEntries(data.map(r => [r.cle, r.valeur]))
}

export default async function MentionsLegales() {
  const infos = await getInfos()
  const entreprise = infos.nom_entreprise || 'SHIRI CARS'
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-marine-900 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-slate-400 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl font-black">Mentions Légales & Confidentialité</h1>
          <p className="text-slate-400 mt-2">Dernière mise à jour : juin 2025</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">1. Éditeur du site</h2>
          <p className="text-slate-600 leading-relaxed">
            Le site est édité par <strong>{entreprise}</strong>, spécialisé dans la vente de véhicules d&apos;occasion.
          </p>
          {(infos.siret || infos.adresse || infos.directeur_publication) && (
            <ul className="mt-3 text-slate-600 space-y-1">
              {infos.adresse && <li><strong>Adresse :</strong> {infos.adresse}</li>}
              {infos.siret && <li><strong>SIRET :</strong> {infos.siret}</li>}
              {infos.tva && <li><strong>TVA intracommunautaire :</strong> {infos.tva}</li>}
              {infos.directeur_publication && <li><strong>Directeur de la publication :</strong> {infos.directeur_publication}</li>}
              {infos.email && <li><strong>Contact :</strong> {infos.email}</li>}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">2. Hébergement</h2>
          <p className="text-slate-600 leading-relaxed">
            Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 603, San Francisco, CA 94104, USA.
            Les données sont stockées sur <strong>Supabase</strong> (infrastructure cloud sécurisée).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">3. Données personnelles collectées</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            Lorsque vous utilisez notre formulaire de contact, nous collectons les informations suivantes :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li>Prénom et nom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone (optionnel)</li>
            <li>Contenu de votre message</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-3">
            Ces données sont utilisées <strong>uniquement</strong> pour répondre à votre demande. Elles ne sont jamais vendues ni transmises à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">4. Durée de conservation</h2>
          <p className="text-slate-600 leading-relaxed">
            Vos données personnelles sont conservées pendant une durée maximale de <strong>3 ans</strong> à compter de votre dernier contact avec nous,
            conformément aux recommandations de la CNIL.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">5. Vos droits (RGPD)</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li><strong>Droit d&apos;accès</strong> — consulter vos données</li>
            <li><strong>Droit de rectification</strong> — corriger vos données</li>
            <li><strong>Droit à l&apos;effacement</strong> — supprimer vos données</li>
            <li><strong>Droit d&apos;opposition</strong> — vous opposer au traitement</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-3">
            Pour exercer ces droits, contactez-nous via le formulaire du site. Nous répondrons dans un délai de 30 jours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">6. Cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            Ce site utilise uniquement des <strong>cookies essentiels</strong> au bon fonctionnement (préférences d&apos;affichage, session).
            Aucun cookie publicitaire ou de traçage n&apos;est utilisé. Vous pouvez refuser les cookies via la bannière affichée lors de votre première visite,
            sans que cela affecte l&apos;utilisation du site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">7. Propriété intellectuelle</h2>
          <p className="text-slate-600 leading-relaxed">
            L&apos;ensemble des contenus présents sur ce site (textes, images, logos) est la propriété exclusive de SHIRI CARS.
            Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">8. Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            Pour toute question relative à vos données personnelles ou à ces mentions légales, utilisez notre{' '}
            <Link href="/#contact" className="text-blue-600 hover:underline">formulaire de contact</Link>.
          </p>
        </section>

      </div>

      <div className="border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} SHIRI CARS — Tous droits réservés
      </div>
    </div>
  )
}
