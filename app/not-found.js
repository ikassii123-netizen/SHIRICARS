import Link from 'next/link'

export const metadata = { title: 'Page introuvable — SHIRI CARS' }

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center font-black text-white text-2xl mx-auto mb-6">
          SC
        </div>
        <h1 className="text-8xl font-black text-slate-200 mb-2">404</h1>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Page introuvable</h2>
        <p className="text-slate-500 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn-primary inline-block">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
