'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULTS = {
  adresse:   'Paris, France',
  telephone: '+33 1 23 45 67 89',
  email:     'contact@shiricars.fr',
  horaires:  'Lundi – Samedi : 9h00 – 19h00',
  maps_lien:  '',
  maps_embed: '',
}

export default function ContactForm() {
  const [form, setForm]       = useState({ prenom: '', nom: '', email: '', telephone: '', message: '' })
  const [etat, setEtat]       = useState('idle')
  const [infos, setInfos]     = useState(DEFAULTS)

  useEffect(() => {
    supabase.from('parametres').select('cle, valeur').then(({ data }) => {
      if (data?.length) {
        const map = Object.fromEntries(data.map(r => [r.cle, r.valeur]))
        setInfos(prev => ({ ...prev, ...map }))
      }
    })
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setEtat('loading')
    const payload = {
      prenom:    form.prenom,
      nom:       form.nom,
      email:     form.email,
      telephone: form.telephone || null,
      message:   form.message,
    }
    const { error } = await supabase.from('contacts').insert([payload])
    if (error) { setEtat('error'); return }

    // Notification email (silencieuse si non configuré)
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {})

    setEtat('success')
    setForm({ prenom: '', nom: '', email: '', telephone: '', message: '' })
  }

  const coordonnees = [
    { icon: '📍', title: 'Adresse',   value: infos.adresse },
    { icon: '📞', title: 'Téléphone', value: infos.telephone },
    { icon: '✉️', title: 'Email',     value: infos.email },
    { icon: '🕐', title: 'Horaires',  value: infos.horaires },
  ]

  const adresseEncode = encodeURIComponent(infos.adresse || 'Paris, France')
  const iframeSrc = infos.maps_embed || `https://maps.google.com/maps?q=${adresseEncode}&output=embed&z=15`
  const mapsLien  = infos.maps_lien  || `https://maps.google.com/maps?q=${adresseEncode}`

  return (
    <section id="contact" className="bg-marine-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Infos */}
          <div>
            <h2 className="text-3xl font-black mb-3">Nous Contacter</h2>
            <p className="text-slate-400 text-lg mb-10">
              Une question sur un véhicule ? Vous souhaitez organiser un essai ?<br />
              Notre équipe vous répond rapidement.
            </p>
            <div className="space-y-6">
              {coordonnees.map(({ icon, title, value }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-marine-700 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm font-medium">{title}</div>
                    <div className="text-white font-semibold">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton itinéraire */}
            <a
              href={mapsLien}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center gap-3 w-full bg-marine-700 hover:bg-marine-600 transition-colors rounded-2xl px-5 py-4"
            >
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">Voir l'itinéraire</div>
                <div className="text-slate-400 text-xs">{infos.adresse}</div>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Carte intégrée */}
            <div className="mt-4 rounded-2xl overflow-hidden border border-marine-700">
              <iframe
                title="Localisation"
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={iframeSrc}
              />
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-marine-800 rounded-3xl p-8">
            {etat === 'success' ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
                <p className="text-slate-400">Nous vous répondrons dans les 24 heures.</p>
                <button onClick={() => setEtat('idle')} className="mt-6 text-sm text-slate-400 hover:text-white underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Prénom *</label>
                    <input type="text" required value={form.prenom} onChange={e => set('prenom', e.target.value)}
                      placeholder="Jean" className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nom *</label>
                    <input type="text" required value={form.nom} onChange={e => set('nom', e.target.value)}
                      placeholder="Dupont" className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                  <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="jean.dupont@email.com" className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Téléphone</label>
                  <input type="tel" value={form.telephone} onChange={e => set('telephone', e.target.value)}
                    placeholder="+33 6 12 34 56 78" className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Message *</label>
                  <textarea required rows={4} value={form.message} onChange={e => set('message', e.target.value)}
                    placeholder="Je suis intéressé par..." className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500 resize-none" />
                </div>
                {etat === 'error' && (
                  <p className="text-red-400 text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                )}
                <button type="submit" disabled={etat === 'loading'} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {etat === 'loading' ? 'Envoi en cours...' : 'Envoyer le Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
