'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ContactForm() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', message: '' })
  const [etat, setEtat] = useState('idle') // idle | loading | success | error

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setEtat('loading')
    const { error } = await supabase.from('contacts').insert([{
      prenom:    form.prenom,
      nom:       form.nom,
      email:     form.email,
      telephone: form.telephone || null,
      message:   form.message,
    }])
    if (error) {
      setEtat('error')
    } else {
      setEtat('success')
      setForm({ prenom: '', nom: '', email: '', telephone: '', message: '' })
    }
  }

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
              {[
                { icon: '📍', title: 'Adresse',  value: 'Paris, France' },
                { icon: '📞', title: 'Téléphone', value: '+33 1 23 45 67 89' },
                { icon: '✉️', title: 'Email',     value: 'contact@shiricars.fr' },
                { icon: '🕐', title: 'Horaires',  value: 'Lundi – Samedi : 9h00 – 19h00' },
              ].map(({ icon, title, value }) => (
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
          </div>

          {/* Formulaire */}
          <div className="bg-marine-800 rounded-3xl p-8">
            {etat === 'success' ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
                <p className="text-slate-400">Nous vous répondrons dans les 24 heures.</p>
                <button
                  onClick={() => setEtat('idle')}
                  className="mt-6 text-sm text-slate-400 hover:text-white underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Prénom *</label>
                    <input
                      type="text" required value={form.prenom}
                      onChange={e => set('prenom', e.target.value)}
                      placeholder="Jean"
                      className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nom *</label>
                    <input
                      type="text" required value={form.nom}
                      onChange={e => set('nom', e.target.value)}
                      placeholder="Dupont"
                      className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Téléphone</label>
                  <input
                    type="tel" value={form.telephone}
                    onChange={e => set('telephone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Message *</label>
                  <textarea
                    required rows={4} value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Je suis intéressé par la Peugeot 308..."
                    className="input-field bg-marine-900 border-marine-600 text-white placeholder-slate-500 resize-none"
                  />
                </div>

                {etat === 'error' && (
                  <p className="text-red-400 text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                )}

                <button
                  type="submit"
                  disabled={etat === 'loading'}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
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
