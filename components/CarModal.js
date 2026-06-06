'use client'
import { useEffect, useRef, useState } from 'react'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80'

function formatPrix(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function formatKm(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' km'
}

export default function CarModal({ voiture, onClose, whatsapp = '', onFilterDisponible }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartX = useRef(null)
  const photoIdxRef = useRef(0)
  const lightboxRef = useRef(false)
  const isDraggingRef = useRef(false)
  const hasDraggedRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const pinchStartRef = useRef(null)
  const imgRef = useRef(null)
  const zoomScaleRef = useRef(1)
  const panXRef = useRef(0)
  const panYRef = useRef(0)
  const swipeLightboxStartRef = useRef(null)
  zoomScaleRef.current = zoomScale
  panXRef.current = panX
  panYRef.current = panY
  photoIdxRef.current = photoIdx
  lightboxRef.current = lightboxOpen

  const photos = voiture?.photos?.length ? voiture.photos : [PLACEHOLDER]

  const clampPan = (px, py, scale) => {
    const el = imgRef.current
    if (!el) return { px, py }
    const maxX = Math.max(0, (el.offsetWidth * scale - window.innerWidth) / 2)
    const maxY = Math.max(0, (el.offsetHeight * scale - window.innerHeight) / 2)
    return {
      px: Math.max(-maxX, Math.min(maxX, px)),
      py: Math.max(-maxY, Math.min(maxY, py)),
    }
  }

  const resetZoom = () => { setZoomScale(1); setPanX(0); setPanY(0) }

  const goTo = (idx) => {
    if (!fade) return
    resetZoom()
    setFade(false)
    setTimeout(() => { setPhotoIdx(idx); setFade(true) }, 150)
  }

  const openLightbox = () => { resetZoom(); setLightboxOpen(true) }
  const closeLightbox = () => { setLightboxOpen(false); resetZoom() }

  const handleLightboxMouseDown = (e) => {
    hasDraggedRef.current = false
    if (zoomScale <= 1) return
    e.preventDefault()
    e.stopPropagation()
    isDraggingRef.current = true
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY }
  }
  const handleLightboxMouseMove = (e) => {
    if (!isDraggingRef.current) return
    hasDraggedRef.current = true
    const raw = { px: e.clientX - dragStartRef.current.x, py: e.clientY - dragStartRef.current.y }
    const clamped = clampPan(raw.px, raw.py, zoomScale)
    setPanX(clamped.px)
    setPanY(clamped.py)
  }
  const handleLightboxMouseUp = () => { isDraggingRef.current = false; setIsDragging(false) }

  const handleImageClick = (e) => {
    e.stopPropagation()
    if (hasDraggedRef.current) return
    if (zoomScale > 1) { resetZoom(); return }
    const el = imgRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const newScale = 2.5
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const raw = { px: -dx * (newScale - 1), py: -dy * (newScale - 1) }
    const clamped = clampPan(raw.px, raw.py, newScale)
    setPanX(clamped.px)
    setPanY(clamped.py)
    setZoomScale(newScale)
  }

  useEffect(() => {
    if (!lightboxOpen) return

    const getPinchDist = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    const clampRef = (px, py, scale) => {
      const el = imgRef.current
      if (!el) return { px, py }
      const maxX = Math.max(0, (el.offsetWidth * scale - window.innerWidth) / 2)
      const maxY = Math.max(0, (el.offsetHeight * scale - window.innerHeight) / 2)
      return {
        px: Math.max(-maxX, Math.min(maxX, px)),
        py: Math.max(-maxY, Math.min(maxY, py)),
      }
    }

    const onTouchStart = (e) => {
      if (e.target.closest('button')) return  // laisser les boutons fléches fonctionner
      if (e.touches.length === 2) {
        e.preventDefault()
        pinchStartRef.current = { distance: getPinchDist(e.touches), scale: zoomScaleRef.current }
        swipeLightboxStartRef.current = null
      } else if (e.touches.length === 1) {
        if (zoomScaleRef.current > 1) {
          e.preventDefault()
          const t = e.touches[0]
          isDraggingRef.current = true
          dragStartRef.current = { x: t.clientX - panXRef.current, y: t.clientY - panYRef.current }
        } else {
          swipeLightboxStartRef.current = e.touches[0].clientX
        }
      }
    }

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinchStartRef.current) {
        e.preventDefault()
        const newDist = getPinchDist(e.touches)
        const newScale = Math.min(4, Math.max(1, pinchStartRef.current.scale * (newDist / pinchStartRef.current.distance)))
        if (newScale <= 1) { setZoomScale(1); setPanX(0); setPanY(0) }
        else {
          const clamped = clampRef(panXRef.current, panYRef.current, newScale)
          setZoomScale(newScale)
          setPanX(clamped.px)
          setPanY(clamped.py)
        }
      } else if (e.touches.length === 1 && isDraggingRef.current && zoomScaleRef.current > 1) {
        e.preventDefault()
        const raw = { px: e.touches[0].clientX - dragStartRef.current.x, py: e.touches[0].clientY - dragStartRef.current.y }
        const clamped = clampRef(raw.px, raw.py, zoomScaleRef.current)
        setPanX(clamped.px)
        setPanY(clamped.py)
      }
    }

    const onTouchEnd = (e) => {
      if (e.touches.length < 2) pinchStartRef.current = null
      if (e.touches.length === 0) {
        isDraggingRef.current = false
        setIsDragging(false)
        // Swipe para navegar fotos (solo cuando no hay zoom)
        if (swipeLightboxStartRef.current !== null && zoomScaleRef.current <= 1) {
          const delta = e.changedTouches[0].clientX - swipeLightboxStartRef.current
          if (Math.abs(delta) > 50) {
            const total = photos.length
            const next = delta < 0
              ? (photoIdxRef.current + 1) % total
              : (photoIdxRef.current - 1 + total) % total
            setPhotoIdx(next)
            photoIdxRef.current = next
          }
        }
        swipeLightboxStartRef.current = null
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: false })
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [lightboxOpen])

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) {
      goTo(delta < 0
        ? (photoIdxRef.current + 1) % photos.length
        : (photoIdxRef.current - 1 + photos.length) % photos.length
      )
    }
    touchStartX.current = null
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = e => {
      if (e.key === 'Escape') {
        if (lightboxRef.current) closeLightbox()
        else onClose()
      }
      if (e.key === 'ArrowRight') goTo((photoIdxRef.current + 1) % photos.length)
      if (e.key === 'ArrowLeft') goTo((photoIdxRef.current - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [onClose])

  if (!voiture) return null

  const vendu   = voiture.statut === 'vendu'
  const reserve = voiture.statut === 'reserve'
  const pct = voiture.prix_barre && voiture.prix_barre !== voiture.prix
    ? Math.round(((voiture.prix - voiture.prix_barre) / voiture.prix_barre) * 100)
    : null

  return (
    <>
      {/* Modal principal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-0">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {voiture.marque} {voiture.modele}
              </h2>
              <p className="text-slate-500">{voiture.annee} · {formatKm(voiture.kilometrage)}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Photos */}
            <div>
              <div
                className="relative rounded-2xl overflow-hidden h-96 bg-slate-100 group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Imagen principal — clic abre lightbox */}
                <img
                  src={photos[photoIdx]}
                  alt={`${voiture.marque} ${voiture.modele}`}
                  className="w-full h-full object-cover transition-opacity duration-150 cursor-zoom-in"
                  style={{ opacity: fade ? 1 : 0 }}
                  onClick={openLightbox}
                  onError={e => { e.target.src = PLACEHOLDER }}
                />

                {/* Icono zoom (hint visual) */}
                <div className="absolute bottom-3 right-3 z-10 bg-black/40 backdrop-blur-sm text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Agrandir
                </div>

                {/* Overlay diagonal VENDU / RÉSERVÉ */}
                {(vendu || reserve) && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden pointer-events-none">
                    <div className={`w-[140%] py-3 text-center font-black text-white text-lg tracking-widest shadow-2xl transform rotate-[-28deg] ${vendu ? 'bg-red-600/90' : 'bg-amber-500/90'}`}>
                      {vendu ? 'VENDU' : 'RÉSERVÉ'}
                    </div>
                  </div>
                )}

                {/* Badge statut */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={
                    vendu   ? 'badge-vendu' :
                    reserve ? 'badge-reserve' :
                    'badge-disponible'
                  }>
                    {vendu ? 'Vendu' : reserve ? 'Réservé' : 'Disponible'}
                  </span>
                </div>

                {/* Contador */}
                {photos.length > 1 && (
                  <div className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {photoIdx + 1} / {photos.length}
                  </div>
                )}

                {/* Badge descuento (solo si 1 foto) */}
                {pct && !vendu && photos.length === 1 && (
                  <div className={`absolute top-3 right-3 z-10 text-white text-xs font-bold px-2 py-1 rounded-lg ${pct < 0 ? 'bg-red-600' : 'bg-green-600'}`}>
                    {pct > 0 ? `+${pct}%` : `${pct}%`}
                  </div>
                )}

                {/* Flecha PREV */}
                {photos.length > 1 && (
                  <button
                    onClick={() => goTo((photoIdx - 1 + photos.length) % photos.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white rounded-full transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90"
                    aria-label="Photo précédente"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Flecha NEXT */}
                {photos.length > 1 && (
                  <button
                    onClick={() => goTo((photoIdx + 1) % photos.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white rounded-full transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90"
                    aria-label="Photo suivante"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Dots */}
                {photos.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`rounded-full transition-all duration-200 ${
                          i === photoIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Photo ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Strip de thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {photos.map((p, i) => (
                    <button key={i} onClick={() => goTo(i)} className="flex-shrink-0">
                      <img
                        src={p}
                        alt={`${voiture.marque} ${voiture.modele} - photo ${i + 1}`}
                        className={`w-16 h-12 object-cover rounded-lg border-2 transition-all duration-200 ${
                          i === photoIdx
                            ? 'border-red-500 scale-105 shadow-md'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        onError={e => { e.target.src = PLACEHOLDER }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prix */}
            {!vendu && (
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">Prix</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-marine-700">
                    {formatPrix(voiture.prix)}
                  </span>
                  {voiture.prix_barre && voiture.prix_barre !== voiture.prix && (
                    <span className="text-slate-400 line-through text-base">
                      {formatPrix(voiture.prix_barre)}
                    </span>
                  )}
                </div>
              </div>
              {pct && (
                <div className={`font-black text-xl px-4 py-2 rounded-xl ${pct < 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                </div>
              )}
            </div>
            )}

            {/* Caractéristiques */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Caractéristiques</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Carburant', value: voiture.carburant },
                  { label: 'Transmission', value: voiture.transmission },
                  { label: 'Kilométrage', value: formatKm(voiture.kilometrage) },
                  { label: 'Année', value: voiture.annee },
                  voiture.couleur         ? { label: 'Couleur', value: voiture.couleur } : null,
                  voiture.puissance_cv    ? { label: 'Puissance', value: `${voiture.puissance_cv} CV` } : null,
                  voiture.nb_portes       ? { label: 'Portes', value: `${voiture.nb_portes} portes` } : null,
                  voiture.nb_proprietaires ? { label: 'Propriétaires', value: voiture.nb_proprietaires === 1 ? '1ère main' : `${voiture.nb_proprietaires} propriétaires` } : null,
                  voiture.cylindree       ? { label: 'Cylindrée', value: `${voiture.cylindree} cm³` } : null,
                  voiture.puissance_fiscale ? { label: 'Puiss. fiscale', value: `${voiture.puissance_fiscale} CV` } : null,
                ].filter(Boolean).map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 font-medium mb-1">{label}</div>
                    <div className="font-semibold text-slate-800">{value}</div>
                  </div>
                ))}
              </div>
              {voiture.controle_technique && (
                <div className="mt-3 bg-slate-50 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-lg">🔧</span>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Contrôle Technique</div>
                    <div className="font-semibold text-slate-800">{voiture.controle_technique}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {voiture.description && (
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">{voiture.description}</p>
              </div>
            )}

            {/* CTA */}
            {!vendu && !reserve && (
              <a
                href="#contact"
                onClick={onClose}
                className="w-full text-center block btn-primary"
              >
                Je suis intéressé — Nous contacter
              </a>
            )}
            {reserve && (
              <button
                onClick={() => {
                  onClose()
                  if (onFilterDisponible) onFilterDisponible()
                  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full text-center block btn-primary"
              >
                Voir les véhicules disponibles
              </button>
            )}
            {vendu && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé par un véhicule similaire au ${voiture.marque} ${voiture.modele} (${voiture.annee}). Pouvez-vous m'informer si un modèle similaire est disponible ?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center block btn-primary bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
              >
                M'avertir d'une arrivée similaire
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox pantalla completa con zoom rueda + arrastrar */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center overflow-hidden"
          onClick={closeLightbox}
          onMouseMove={handleLightboxMouseMove}
          onMouseUp={handleLightboxMouseUp}
          onMouseLeave={handleLightboxMouseUp}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contador + nivel zoom */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            {photos.length > 1 && (
              <div className="bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                {photoIdx + 1} / {photos.length}
              </div>
            )}
            {zoomScale > 1 && (
              <div className="bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                {zoomScale.toFixed(1)}×
              </div>
            )}
          </div>

          {/* Imagen con zoom y pan */}
          <div className="lightbox-area w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img
              src={photos[photoIdx]}
              alt={`${voiture.marque} ${voiture.modele}`}
              ref={imgRef}
              className="object-contain select-none"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`,
                transformOrigin: 'center center',
                cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              }}
              onMouseDown={handleLightboxMouseDown}
              onClick={handleImageClick}
              onError={e => { e.target.src = PLACEHOLDER }}
              draggable={false}
            />
          </div>

          {/* Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs text-center pointer-events-none">
            {zoomScale > 1 ? 'Glissez pour explorer · Appuyez pour réinitialiser' : 'Pincez pour zoomer · Glissez pour naviguer'}
          </div>

          {/* Flechas */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); goTo((photoIdx - 1 + photos.length) % photos.length) }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white rounded-full transition-all duration-200 active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); goTo((photoIdx + 1) % photos.length) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white rounded-full transition-all duration-200 active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}
