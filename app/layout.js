import './globals.css'

export const metadata = {
  title: 'SHIRI CARS — Véhicules Français d\'Exception',
  description: 'Découvrez notre sélection de voitures françaises de qualité. Peugeot, Renault, Citroën, DS — des véhicules vérifiés à prix transparents.',
  keywords: 'voitures françaises, occasion, Peugeot, Renault, Citroën, DS, vente auto',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
