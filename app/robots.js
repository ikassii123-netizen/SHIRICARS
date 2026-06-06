export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/admin' },
    ],
    sitemap: 'https://shiricars.fr/sitemap.xml',
  }
}
