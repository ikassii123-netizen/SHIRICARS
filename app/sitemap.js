export default function sitemap() {
  return [
    { url: 'https://shiricars.fr', lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: 'https://shiricars.fr/#catalogue', lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: 'https://shiricars.fr/#contact',   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://shiricars.fr/a-propos',   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://shiricars.fr/mentions-legales', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
