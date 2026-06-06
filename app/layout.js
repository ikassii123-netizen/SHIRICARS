import './globals.css'
import { createClient } from '@supabase/supabase-js'
import CookieBanner from '../components/CookieBanner'
import WhatsAppButton from '../components/WhatsAppButton'

async function getSiteTitle() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data } = await supabase
    .from('parametres')
    .select('cle, valeur')
    .in('cle', ['titre_site', 'description_site'])
  if (!data?.length) return {}
  return Object.fromEntries(data.map(r => [r.cle, r.valeur]))
}

export async function generateMetadata() {
  try {
    const params = await getSiteTitle()
    return {
      title: params.titre_site || 'SY CAR — Véhicules Français d\'Exception',
      description: params.description_site || 'Découvrez notre sélection de voitures françaises de qualité. Peugeot, Renault, Citroën, DS — des véhicules vérifiés à prix transparents.',
      keywords: 'voitures françaises, occasion, Peugeot, Renault, Citroën, DS, vente auto',
    }
  } catch {
    return {
      title: 'SY CAR — Véhicules Français d\'Exception',
      description: 'Découvrez notre sélection de voitures françaises de qualité. Peugeot, Renault, Citroën, DS — des véhicules vérifiés à prix transparents.',
    }
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
        <WhatsAppButton />
        <CookieBanner />
      </body>
    </html>
  )
}
