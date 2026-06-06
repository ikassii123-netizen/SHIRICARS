import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function getConfig() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data } = await supabase
    .from('parametres')
    .select('cle, valeur')
    .in('cle', ['email', 'resend_api_key', 'nom_entreprise', 'resend_from', 'adresse'])
  if (!data?.length) return {}
  return Object.fromEntries(data.map(r => [r.cle, r.valeur]))
}

export async function POST(req) {
  try {
    const { prenom, nom, email, telephone, message } = await req.json()
    const safePrenom    = escapeHtml(prenom)
    const safeNom       = escapeHtml(nom)
    const safeEmail     = escapeHtml(email)
    const safeTelephone = telephone ? escapeHtml(telephone) : ''
    const safeMessage   = escapeHtml(message).replace(/\n/g, '<br>')

    const config = await getConfig()
    if (!config.resend_api_key || !config.email) {
      return Response.json({ ok: true })
    }

    const resend     = new Resend(config.resend_api_key)
    const entreprise = config.nom_entreprise || 'SY CAR'
    const initiales  = entreprise.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const emailPro   = config.email
    // Si domaine vérifié dans Resend, utiliser ex: "contact@shiricars.fr"
    // Sinon laisser vide → utilise onboarding@resend.dev (envoi limité à l'email du compte Resend)
    const fromAddr   = config.resend_from || `${entreprise} <onboarding@resend.dev>`

    // Email 1 → notification à l'entreprise
    const { error: err1 } = await resend.emails.send({
      from:    fromAddr,
      to:      emailPro,
      subject: `Nouveau message de ${safePrenom} ${safeNom}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0f172a;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:20px">Nouveau message — ${escapeHtml(entreprise)}</h1>
          </div>
          <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:120px">Nom</td>
                  <td style="padding:8px 0;font-weight:600;color:#0f172a">${safePrenom} ${safeNom}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:14px">Email</td>
                  <td style="padding:8px 0;font-weight:600"><a href="mailto:${safeEmail}" style="color:#2563eb">${safeEmail}</a></td></tr>
              ${safeTelephone ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px">Téléphone</td>
                  <td style="padding:8px 0;font-weight:600;color:#0f172a">${safeTelephone}</td></tr>` : ''}
            </table>
            <div style="margin-top:16px;background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px">
              <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;font-weight:600">Message</div>
              <p style="margin:0;color:#334155;line-height:1.6">${safeMessage}</p>
            </div>
            <div style="margin-top:16px;text-align:center">
              <a href="mailto:${safeEmail}" style="background:#dc2626;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
                Répondre à ${safePrenom}
              </a>
            </div>
          </div>
        </div>
      `,
    })

    if (err1) console.error('[Resend] Erreur email entreprise:', err1)

    // Email 2 → confirmation au client
    // Nécessite un domaine vérifié dans Resend pour fonctionner avec n'importe quelle adresse client
    const { error: err2 } = await resend.emails.send({
      from:    fromAddr,
      to:      email,
      subject: `Votre demande a bien été reçue — ${escapeHtml(entreprise)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0f172a;padding:24px;border-radius:12px 12px 0 0;text-align:center">
            <div style="width:48px;height:48px;background:#dc2626;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
              <span style="color:white;font-weight:900;font-size:16px">${escapeHtml(initiales)}</span>
            </div>
            <h1 style="color:white;margin:0;font-size:20px">${escapeHtml(entreprise)}</h1>
          </div>
          <div style="background:#f8fafc;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;text-align:center">
            <div style="font-size:48px;margin-bottom:16px">✅</div>
            <h2 style="color:#0f172a;margin:0 0 12px">Merci, ${safePrenom} !</h2>
            <p style="color:#64748b;line-height:1.6;margin:0 0 24px">
              Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
            </p>
            <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:left;margin-bottom:24px">
              <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;font-weight:600">Votre message</div>
              <p style="margin:0;color:#334155;line-height:1.6;font-size:14px">${safeMessage}</p>
            </div>
            <p style="color:#94a3b8;font-size:13px;margin:0">
              ${escapeHtml(config.adresse || '')}<br>
              <a href="mailto:${escapeHtml(emailPro)}" style="color:#2563eb">${escapeHtml(emailPro)}</a>
            </p>
          </div>
        </div>
      `,
    })

    if (err2) console.error('[Resend] Erreur email client:', err2)

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[Resend] Erreur inattendue:', e)
    return Response.json({ ok: true })
  }
}
