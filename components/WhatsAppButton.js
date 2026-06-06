'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function WhatsAppButton() {
  const [config, setConfig] = useState({ numero: '', message: '' })

  useEffect(() => {
    supabase.from('parametres').select('cle, valeur')
      .in('cle', ['whatsapp', 'telephone', 'nom_entreprise', 'whatsapp_message'])
      .then(({ data }) => {
        if (!data?.length) return
        const map = Object.fromEntries(data.map(r => [r.cle, r.valeur]))
        const tel = map.whatsapp || map.telephone || ''
        const entreprise = map.nom_entreprise || 'SHIRI CARS'
        const message = map.whatsapp_message ||
          `Bonjour ${entreprise}, je suis intéressé(e) par un de vos véhicules. Pouvez-vous me renseigner ?`
        setConfig({ numero: tel, message })
      })
  }, [])

  const numero = config.numero.replace(/\D/g, '').replace(/^0/, '33')
  if (!numero) return null

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(config.message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.023 7.77L0 32l8.43-2.007A15.934 15.934 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.773-1.852l-.486-.29-5.003 1.192 1.268-4.865-.317-.5A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.907c-.398-.2-2.355-1.163-2.72-1.295-.365-.133-.63-.2-.896.2-.266.398-1.03 1.295-1.263 1.562-.232.266-.465.3-.863.1-.398-.2-1.682-.62-3.203-1.978-1.184-1.057-1.983-2.362-2.215-2.76-.232-.398-.025-.613.174-.812.18-.178.398-.465.597-.698.2-.232.266-.398.398-.664.133-.266.067-.498-.033-.698-.1-.2-.896-2.16-1.228-2.96-.323-.777-.65-.672-.896-.684l-.763-.013c-.266 0-.697.1-1.063.498-.365.398-1.395 1.363-1.395 3.323s1.428 3.855 1.628 4.122c.2.266 2.81 4.29 6.81 6.02.952.41 1.695.655 2.274.838.956.303 1.826.26 2.513.158.767-.114 2.355-.963 2.688-1.893.333-.93.333-1.728.233-1.893-.1-.166-.365-.266-.763-.465z"/>
      </svg>
    </a>
  )
}
