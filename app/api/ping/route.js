import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    await supabase.from('voitures').select('id').limit(1)
    return Response.json({ ok: true, ts: new Date().toISOString() })
  } catch {
    return Response.json({ ok: false }, { status: 500 })
  }
}
