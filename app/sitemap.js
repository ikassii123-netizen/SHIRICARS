const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://shiricars.fr'

export default function sitemap() {
  return [
    { url: BASE,                        lastModified: new Date(), changeFrequency: 'daily',   priority: 1   },
    { url: `${BASE}/#catalogue`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/#contact`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/a-propos`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/mentions-legales`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
