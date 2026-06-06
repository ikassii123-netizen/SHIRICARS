'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatPrix(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

const CARBURANTS     = ['Essence', 'Diesel', 'Hybride', 'Hybride Rechargeable', 'Électrique']
const TRANSMISSIONS  = ['Manuelle', 'Automatique', 'Semi-automatique']
const VIDE = {
  marque: '', modele: '', annee: new Date().getFullYear(),
  kilometrage: 0, carburant: 'Essence', transmission: 'Manuelle',
  prix: '', prix_barre: '', statut: 'disponible', description: '',
}

// ─── Composant Login ──────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [err, setErr]     = useState('')
  const [load, setLoad]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoad(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setErr('Email ou mot de passe incorrect.')
    else onLogin()
    setLoad(false)
  }

  return (
    <div className="min-h-screen bg-marine-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center font-black text-white text-xl mx-auto mb-4">SC</div>
          <h1 className="text-2xl font-black text-slate-900">Administration</h1>
          <p className="text-slate-500 mt-1">SY CAR — Espace sécurisé</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="input-field" placeholder="admin@sycar.fr" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mot de passe</label>
            <input type="password" required value={pass} onChange={e => setPass(e.target.value)}
              className="input-field" placeholder="••••••••" />
          </div>
          {err && <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{err}</p>}
          <button type="submit" disabled={load} className="btn-primary w-full">
            {load ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>
        <p className="text-center mt-6 text-slate-400 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">← Retour au site</Link>
        </p>
      </div>
    </div>
  )
}

// ─── Formulaire Voiture ────────────────────────────────────────────────────
function VoitureForm({ initial, onSave, onCancel, uploading, onUpload }) {
  const [form, setForm] = useState(initial || VIDE)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    await onSave({
      ...form,
      annee:       parseInt(form.annee),
      kilometrage: parseInt(form.kilometrage),
      prix:        parseFloat(form.prix),
      prix_barre:  form.prix_barre ? parseFloat(form.prix_barre) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Marque *</label>
          <input required value={form.marque} onChange={e => set('marque', e.target.value)}
            className="input-field" placeholder="Peugeot" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Modèle *</label>
          <input required value={form.modele} onChange={e => set('modele', e.target.value)}
            className="input-field" placeholder="308 GT" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Année *</label>
          <input type="number" required min="1990" max={new Date().getFullYear() + 1}
            value={form.annee} onChange={e => set('annee', e.target.value)}
            className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Kilométrage *</label>
          <input type="number" required min="0" value={form.kilometrage}
            onChange={e => set('kilometrage', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Carburant *</label>
          <select value={form.carburant} onChange={e => set('carburant', e.target.value)} className="input-field">
            {CARBURANTS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Transmission *</label>
          <select value={form.transmission} onChange={e => set('transmission', e.target.value)} className="input-field">
            {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Prix de vente (€) *</label>
          <input type="number" required min="0" step="100" value={form.prix}
            onChange={e => set('prix', e.target.value)} className="input-field" placeholder="18500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Prix barré / avant remise (€) <span className="text-slate-400 font-normal">optionnel</span>
          </label>
          <input type="number" min="0" step="100" value={form.prix_barre}
            onChange={e => set('prix_barre', e.target.value)} className="input-field" placeholder="22000" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Statut *</label>
          <select value={form.statut} onChange={e => set('statut', e.target.value)} className="input-field">
            <option value="disponible">Disponible</option>
            <option value="reserve">Réservé</option>
            <option value="vendu">Vendu</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
        <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
          className="input-field resize-none" placeholder="Description du véhicule..." />
      </div>

      {/* Upload photos */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Photos</label>

        {/* Photos existantes */}
        {form.photos?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-slate-400 mb-2">{form.photos.length} photo{form.photos.length !== 1 ? 's' : ''} — la 1ère est la photo principale</p>
            <div className="flex gap-2 flex-wrap">
              {form.photos.map((url, i) => {
                const movePhoto = (from, to) => {
                  const arr = [...form.photos]
                  const [item] = arr.splice(from, 1)
                  arr.splice(to, 0, item)
                  set('photos', arr)
                }
                return (
                  <div key={url} className="relative group flex flex-col items-center gap-1">
                    <div className="relative">
                      <img src={url} className={`w-24 h-16 object-cover rounded-lg border-2 ${i === 0 ? 'border-green-500' : 'border-slate-200'}`} />
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-green-500 text-white text-[9px] font-bold px-1 rounded">
                          PRINCIPALE
                        </span>
                      )}
                      <button type="button"
                        onClick={() => set('photos', form.photos.filter((_, j) => j !== i))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => movePhoto(i, i - 1)} disabled={i === 0}
                        className="w-6 h-5 rounded text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center">
                        ←
                      </button>
                      <button type="button" onClick={() => movePhoto(i, i + 1)} disabled={i === form.photos.length - 1}
                        className="w-6 h-5 rounded text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center">
                        →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Zone pour ajouter des photos */}
        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors ${uploading ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
          <svg className="w-7 h-7 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-slate-500">
            {uploading ? 'Envoi en cours...' : form.photos?.length > 0 ? '+ Ajouter d\'autres photos' : 'Cliquez pour ajouter des photos'}
          </span>
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={e => onUpload(e.target.files, form, f => setForm(f))} disabled={uploading} />
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={uploading} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
          {uploading ? 'Upload en cours...' : initial ? 'Enregistrer les modifications' : 'Ajouter le véhicule'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
      </div>
    </form>
  )
}

// ─── Panel Principal ───────────────────────────────────────────────────────
export default function AdminPage() {
  const [session, setSession]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [voitures, setVoitures]     = useState([])
  const [contacts, setContacts]     = useState([])
  const [mode, setMode]             = useState('liste')
  const [current, setCurrent]       = useState(null)
  const [uploading, setUploading]   = useState(false)
  const [onglet, setOnglet]         = useState('voitures') // voitures | messages | parametres
  const [toast, setToast]           = useState(null)
  const [parametres, setParametres] = useState({
    titre_site: '', description_site: '', nom_entreprise: '', slogan: '', adresse: '', telephone: '', email: '', horaires: '', resend_api_key: '', whatsapp: '', whatsapp_message: '', siret: '', tva: '', directeur_publication: '', maps_lien: '', maps_embed: ''
  })
  const [showResendKey, setShowResendKey] = useState(false)
  const [savingParams, setSavingParams] = useState(false)
  const [confirmModal, setConfirmModal] = useState(null)

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const revalidate = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return
    fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadVoitures = useCallback(async () => {
    const { data } = await supabase.from('voitures').select('*').order('date_ajout', { ascending: false })
    setVoitures(data || [])
  }, [])

  const loadContacts = useCallback(async () => {
    const { data } = await supabase.from('contacts').select('*').order('date_envoi', { ascending: false })
    setContacts(data || [])
  }, [])

  const loadParametres = useCallback(async () => {
    const { data } = await supabase.from('parametres').select('cle, valeur')
    if (data?.length) {
      const map = Object.fromEntries(data.map(r => [r.cle, r.valeur]))
      setParametres(prev => ({ ...prev, ...map }))
    }
  }, [])

  useEffect(() => {
    if (session) { loadVoitures(); loadContacts(); loadParametres() }
  }, [session, loadVoitures, loadContacts, loadParametres])

  async function saveParametres(e) {
    e.preventDefault()
    setSavingParams(true)
    const upserts = Object.entries(parametres)
      .map(([cle, valeur]) => ({ cle, valeur }))
    const { error } = await supabase.from('parametres').upsert(upserts, { onConflict: 'cle' })
    if (!error) { revalidate(); showToast('Paramètres sauvegardés avec succès') }
    else showToast('Erreur lors de la sauvegarde', 'err')
    setSavingParams(false)
  }

  async function handleUpload(files, form, setForm) {
    const lista = Array.from(files)

    const heic = lista.filter(f => f.type === 'image/heic' || f.type === 'image/heif' || f.name.toLowerCase().endsWith('.heic') || f.name.toLowerCase().endsWith('.heif'))
    if (heic.length) {
      showToast('Format HEIC non supporté. Sur iPhone : Réglages → Appareil photo → Formats → Compatible.', 'err')
      const autres = lista.filter(f => !heic.includes(f))
      if (!autres.length) return
    }

    const aUploader = lista.filter(f => !heic.includes(f))
    setUploading(true)
    const urls = [...(form.photos || [])]
    let erreurs = 0
    for (const file of aUploader) {
      const ext  = file.name.split('.').pop() || 'jpg'
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('voitures').upload(name, file, { upsert: false })
      if (!error) {
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/voitures/${name}`
        urls.push(publicUrl)
      } else {
        erreurs++
        console.error('Erreur upload Supabase Storage:', error.message, error)
        if (erreurs === 1) showToast(`Erreur upload : ${error.message}`, 'err')
      }
    }
    setForm(f => ({ ...f, photos: urls }))
    setUploading(false)
    if (erreurs > 1) showToast(`${erreurs} photo(s) n'ont pas pu être envoyées.`, 'err')
    else if (erreurs === 0 && aUploader.length > 0) showToast('Photos envoyées avec succès')
  }

  async function doSave(data, cleanPhotos) {
    setConfirmModal(null)
    let savedData = data
    if (cleanPhotos && data.photos?.length > 1) {
      const paths = data.photos.slice(1).map(url => url.split('/voitures/')[1]).filter(Boolean)
      if (paths.length) await supabase.storage.from('voitures').remove(paths)
      savedData = { ...data, photos: [data.photos[0]] }
    }
    if (mode === 'modifier' && current) {
      const { error } = await supabase.from('voitures').update(savedData).eq('id', current.id)
      if (!error) { revalidate(); showToast('Véhicule modifié avec succès'); await loadVoitures(); setMode('liste') }
      else showToast('Erreur lors de la modification', 'err')
    } else {
      const { error } = await supabase.from('voitures').insert([savedData])
      if (!error) { revalidate(); showToast('Véhicule ajouté avec succès'); await loadVoitures(); setMode('liste') }
      else showToast('Erreur lors de l\'ajout', 'err')
    }
  }

  async function handleSave(data) {
    if (data.statut === 'vendu' && data.photos?.length > 1) {
      setConfirmModal({
        mainPhoto:      data.photos[0],
        photosToDelete: data.photos.slice(1),
        onConfirm:      () => doSave(data, true),
        onCancel:       () => setConfirmModal(null),
      })
      return
    }
    await doSave(data, false)
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce véhicule définitivement ?')) return
    await supabase.from('voitures').delete().eq('id', id)
    revalidate()
    showToast('Véhicule supprimé')
    loadVoitures()
  }

  async function toggleLu(id, lu) {
    await supabase.from('contacts').update({ lu: !lu }).eq('id', id)
    loadContacts()
  }

  async function deleteContact(id) {
    if (!confirm('Supprimer ce message ?')) return
    await supabase.from('contacts').delete().eq('id', id)
    loadContacts()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setMode('liste')
  }

  async function handleBackup() {
    const [{ data: v }, { data: c }, { data: p }] = await Promise.all([
      supabase.from('voitures').select('*').order('date_ajout', { ascending: false }),
      supabase.from('contacts').select('*').order('date_envoi', { ascending: false }),
      supabase.from('parametres').select('*'),
    ])
    const backup = {
      date: new Date().toISOString(),
      voitures: v || [],
      contacts: c || [],
      parametres: p || [],
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sycar-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Sauvegarde téléchargée avec succès')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) return <LoginForm onLogin={() => {}} />

  const nbNonLus = contacts.filter(c => !c.lu).length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-fade-in-up ${
          toast.type === 'err' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toast.type === 'err' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      {/* Modal confirmation suppression photos */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">⚠️</div>
              <h3 className="text-lg font-black text-slate-900">Supprimer les photos ?</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Ce véhicule est marqué <strong>VENDU</strong>. Pour économiser l'espace Supabase, toutes les photos supplémentaires seront supprimées <strong>définitivement</strong>. Seule la photo principale sera conservée.
            </p>
            <div className="mb-4">
              <p className="text-xs font-semibold text-green-600 mb-2">✅ Conservée — photo principale</p>
              <img src={confirmModal.mainPhoto} className="w-28 h-20 object-cover rounded-xl border-2 border-green-400" />
            </div>
            <div className="mb-6">
              <p className="text-xs font-semibold text-red-600 mb-2">
                🗑 Supprimées définitivement — {confirmModal.photosToDelete.length} photo{confirmModal.photosToDelete.length > 1 ? 's' : ''}
              </p>
              <div className="flex gap-2 flex-wrap">
                {confirmModal.photosToDelete.map((url, i) => (
                  <img key={i} src={url} className="w-16 h-12 object-cover rounded-lg border-2 border-red-300 opacity-50" />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={confirmModal.onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                Confirmer et enregistrer
              </button>
              <button onClick={confirmModal.onCancel}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="flex min-h-screen">
        <aside className="w-64 bg-marine-900 text-white flex flex-col fixed left-0 top-0 h-full">
          <div className="p-6 border-b border-marine-700">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center font-black text-sm">
                {(parametres.nom_entreprise || 'SY CAR').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-black text-base">{parametres.nom_entreprise || 'SY CAR'}</div>
                <div className="text-xs text-slate-400">Administration</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => { setOnglet('voitures'); setMode('liste') }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${onglet === 'voitures' ? 'bg-marine-700 text-white' : 'text-slate-400 hover:text-white hover:bg-marine-800'}`}
            >
              🚗 Catalogue Véhicules
              <span className="ml-auto bg-marine-600 text-xs px-2 py-0.5 rounded-full">{voitures.length}</span>
            </button>
            <button
              onClick={() => setOnglet('messages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${onglet === 'messages' ? 'bg-marine-700 text-white' : 'text-slate-400 hover:text-white hover:bg-marine-800'}`}
            >
              ✉️ Messages Clients
              {nbNonLus > 0 && (
                <span className="ml-auto bg-red-600 text-xs px-2 py-0.5 rounded-full">{nbNonLus}</span>
              )}
            </button>
            <button
              onClick={() => setOnglet('parametres')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${onglet === 'parametres' ? 'bg-marine-700 text-white' : 'text-slate-400 hover:text-white hover:bg-marine-800'}`}
            >
              ⚙️ Paramètres du Site
            </button>
          </nav>

          <div className="p-4 border-t border-marine-700">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3 transition-colors">
              ← Voir le site
            </Link>
            <button
              onClick={handleBackup}
              className="w-full text-left text-slate-400 hover:text-emerald-400 text-sm transition-colors mb-2"
            >
              💾 Sauvegarder les données
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left text-slate-400 hover:text-red-400 text-sm transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="ml-64 flex-1 p-8">

          {/* ─── Onglet Véhicules ─── */}
          {onglet === 'voitures' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Catalogue Véhicules</h1>
                  <p className="text-slate-500 text-sm mt-1">{voitures.length} véhicule{voitures.length !== 1 ? 's' : ''} enregistré{voitures.length !== 1 ? 's' : ''}</p>
                </div>
                {mode === 'liste' && (
                  <button onClick={() => setMode('ajouter')} className="btn-primary">
                    + Ajouter un véhicule
                  </button>
                )}
              </div>

              {(mode === 'ajouter' || mode === 'modifier') && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    {mode === 'modifier' ? `Modifier : ${current.marque} ${current.modele}` : 'Nouveau véhicule'}
                  </h2>
                  <VoitureForm
                    initial={mode === 'modifier' ? current : null}
                    onSave={handleSave}
                    onCancel={() => setMode('liste')}
                    uploading={uploading}
                    onUpload={handleUpload}
                  />
                </div>
              )}

              {mode === 'liste' && (
                <div className="space-y-3">
                  {voitures.length === 0 && (
                    <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100">
                      <p className="text-lg font-medium">Aucun véhicule</p>
                      <p className="text-sm mt-1">Cliquez sur &quot;Ajouter un véhicule&quot; pour commencer</p>
                    </div>
                  )}
                  {voitures.map(v => (
                    <div key={v.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {v.photos?.[0]
                          ? <img src={v.photos[0]} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl">🚗</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900">{v.marque} {v.modele} <span className="text-slate-500 font-normal">{v.annee}</span></div>
                        <div className="text-sm text-slate-500">
                          {new Intl.NumberFormat('fr-FR').format(v.kilometrage)} km · {v.carburant} · {v.transmission}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-black text-marine-700 text-lg">{formatPrix(v.prix)}</div>
                        {v.prix_barre && <div className="text-slate-400 line-through text-sm">{formatPrix(v.prix_barre)}</div>}
                      </div>
                      <div className="flex-shrink-0">
                        <span className={
                          v.statut === 'disponible' ? 'badge-disponible' :
                          v.statut === 'reserve'    ? 'badge-reserve' :
                          'badge-vendu'
                        }>
                          {v.statut === 'disponible' ? 'Disponible' : v.statut === 'reserve' ? 'Réservé' : 'Vendu'}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => { setCurrent(v); setMode('modifier') }}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ─── Onglet Paramètres ─── */}
          {onglet === 'parametres' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900">Paramètres du Site</h1>
                <p className="text-slate-500 text-sm mt-1">Modifiez les informations affichées sur votre site. Les changements sont visibles immédiatement.</p>
              </div>

              <form onSubmit={saveParametres} className="space-y-6 max-w-2xl">

                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-bold text-slate-900 mb-4">🌐 Titre de la page (onglet navigateur)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Titre de la page</label>
                      <input value={parametres.titre_site}
                        onChange={e => setParametres(p => ({ ...p, titre_site: e.target.value }))}
                        className="input-field" placeholder="SHIRI CARS — Véhicules Français d'Exception" />
                      <p className="text-xs text-slate-400 mt-1">Texte affiché dans l'onglet du navigateur</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Description (SEO)</label>
                      <textarea rows={2} value={parametres.description_site}
                        onChange={e => setParametres(p => ({ ...p, description_site: e.target.value }))}
                        className="input-field resize-none" placeholder="Découvrez notre sélection de voitures françaises de qualité..." />
                      <p className="text-xs text-slate-400 mt-1">Visible dans les résultats Google</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-bold text-slate-900 mb-4">🏢 Identité de l'entreprise</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Numéro SIRET</label>
                      <input value={parametres.siret}
                        onChange={e => setParametres(p => ({ ...p, siret: e.target.value }))}
                        className="input-field" placeholder="XXX XXX XXX XXXXX" />
                      <p className="text-xs text-slate-400 mt-1">Affiché dans les mentions légales</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Numéro de TVA intracommunautaire</label>
                      <input value={parametres.tva}
                        onChange={e => setParametres(p => ({ ...p, tva: e.target.value }))}
                        className="input-field" placeholder="FR XX XXX XXX XXX" />
                      <p className="text-xs text-slate-400 mt-1">Uniquement si vous êtes SARL/SAS — pas nécessaire en auto-entrepreneur</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Directeur de publication</label>
                      <input value={parametres.directeur_publication}
                        onChange={e => setParametres(p => ({ ...p, directeur_publication: e.target.value }))}
                        className="input-field" placeholder="Prénom Nom" />
                      <p className="text-xs text-slate-400 mt-1">Votre nom complet</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Nom de l'entreprise</label>
                      <input value={parametres.nom_entreprise}
                        onChange={e => setParametres(p => ({ ...p, nom_entreprise: e.target.value }))}
                        className="input-field" placeholder="SHIRI CARS" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Slogan</label>
                      <input value={parametres.slogan}
                        onChange={e => setParametres(p => ({ ...p, slogan: e.target.value }))}
                        className="input-field" placeholder="Véhicules Français d'Exception" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-bold text-slate-900 mb-4">📞 Coordonnées de contact</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">📍 Adresse</label>
                      <input value={parametres.adresse}
                        onChange={e => setParametres(p => ({ ...p, adresse: e.target.value }))}
                        className="input-field" placeholder="12 Rue de la Paix, 75001 Paris" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">🗺️ Lien Google Maps <span className="text-slate-400 font-normal">(bouton itinéraire)</span></label>
                      <input value={parametres.maps_lien}
                        onChange={e => setParametres(p => ({ ...p, maps_lien: e.target.value }))}
                        className="input-field" placeholder="https://maps.app.goo.gl/..." />
                      <p className="text-xs text-slate-400 mt-1">Google Maps → votre adresse → <strong>Partager</strong> → copier le lien</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">🗺️ URL d'intégration Maps <span className="text-slate-400 font-normal">(carte sur le site)</span></label>
                      <input value={parametres.maps_embed}
                        onChange={e => setParametres(p => ({ ...p, maps_embed: e.target.value }))}
                        className="input-field" placeholder="https://www.google.com/maps/embed?pb=..." />
                      <p className="text-xs text-slate-400 mt-1">Google Maps → votre adresse → <strong>Partager → Intégrer une carte</strong> → copier uniquement l'URL dans src="..."</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">📞 Téléphone</label>
                      <input value={parametres.telephone}
                        onChange={e => setParametres(p => ({ ...p, telephone: e.target.value }))}
                        className="input-field" placeholder="+33 1 23 45 67 89" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">✉️ Email (Gmail)</label>
                      <input type="email" value={parametres.email}
                        onChange={e => setParametres(p => ({ ...p, email: e.target.value }))}
                        className="input-field" placeholder="contact@gmail.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">🔑 Clé API Resend (notifications email)</label>
                      <div className="relative">
                        <input
                          type={showResendKey ? 'text' : 'password'}
                          value={parametres.resend_api_key}
                          onChange={e => setParametres(p => ({ ...p, resend_api_key: e.target.value }))}
                          className="input-field pr-12"
                          placeholder="re_xxxxxxxxxxxxxxxxxxxx"
                        />
                        <button type="button" onClick={() => setShowResendKey(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showResendKey ? '🙈' : '👁️'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Disponible sur <strong>resend.com</strong> → API Keys. Une fois configuré, vous et votre client recevrez automatiquement un email à chaque nouvelle demande de contact.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">🕐 Horaires d'ouverture</label>
                      <input value={parametres.horaires}
                        onChange={e => setParametres(p => ({ ...p, horaires: e.target.value }))}
                        className="input-field" placeholder="Lundi – Samedi : 9h00 – 19h00" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-bold text-slate-900 mb-4">💬 WhatsApp</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Numéro WhatsApp</label>
                      <input value={parametres.whatsapp}
                        onChange={e => setParametres(p => ({ ...p, whatsapp: e.target.value }))}
                        className="input-field" placeholder="+33 6 12 34 56 78" />
                      <p className="text-xs text-slate-400 mt-1">Si vide, utilise le numéro de téléphone principal</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Message pré-rempli</label>
                      <textarea rows={3} value={parametres.whatsapp_message}
                        onChange={e => setParametres(p => ({ ...p, whatsapp_message: e.target.value }))}
                        className="input-field resize-none"
                        placeholder="Bonjour, je suis intéressé(e) par un de vos véhicules..." />
                      <p className="text-xs text-slate-400 mt-1">Texte qui apparaît automatiquement quand le client clique sur le bouton WhatsApp</p>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={savingParams} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
                  {savingParams ? 'Sauvegarde en cours...' : '💾 Sauvegarder les paramètres'}
                </button>
              </form>
            </>
          )}

          {/* ─── Onglet Messages ─── */}
          {onglet === 'messages' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900">Messages Clients</h1>
                <p className="text-slate-500 text-sm mt-1">
                  {contacts.length} message{contacts.length !== 1 ? 's' : ''} · {nbNonLus} non lu{nbNonLus !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-3">
                {contacts.length === 0 && (
                  <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100">
                    <p className="text-lg font-medium">Aucun message</p>
                  </div>
                )}
                {contacts.map(c => (
                  <div key={c.id} className={`bg-white rounded-2xl border p-5 shadow-sm ${!c.lu ? 'border-blue-200 bg-blue-50/40' : 'border-slate-100'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-slate-900">{c.prenom} {c.nom}</span>
                          {!c.lu && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">Nouveau</span>}
                          <span className="text-slate-400 text-xs">
                            {new Date(c.date_envoi).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500 mb-2">
                          <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">{c.email}</a>
                          {c.telephone && <span> · {c.telephone}</span>}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{c.message}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => toggleLu(c.id, c.lu)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                          title={c.lu ? 'Marquer non lu' : 'Marquer lu'}>
                          {c.lu ? '📭' : '📬'}
                        </button>
                        <button onClick={() => deleteContact(c.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
