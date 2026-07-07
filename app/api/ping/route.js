import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { error } = await supabase.from('voitures').select('id').limit(1)
    if (error) throw error
    return Response.json({ ok: true, ts: new Date().toISOString() })
  } catch (err) {
    console.error('[ping] Supabase keep-alive failed:', err)
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
