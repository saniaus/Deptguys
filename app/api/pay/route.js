import { getDB } from '../../../lib/db'

export async function POST(req) {
  const db = getDB()
  const { installmentId, debtId } = await req.json()

  const { data } = await db
    .from('installments')
    .select('*')
    .eq('id', installmentId)
    .single()

  if (data.is_paid) return new Response('Already paid', { status: 400 })

  await db.from('installments')
    .update({ is_paid: true })
    .eq('id', installmentId)

  await db.rpc('increment_paid', { debt_id_input: debtId })

  return Response.json({ ok: true })
}
