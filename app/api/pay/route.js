import { getDB } from '../../../lib/db'

export async function POST(req) {
  const db = getDB()
  const { id, amount } = await req.json()

  const { data } = await db
    .from('debts')
    .select('*')
    .eq('id', id)
    .single()

  const newRemaining = Math.max(0, data.remaining - amount)

  await db.from('debts')
    .update({ remaining: newRemaining })
    .eq('id', id)

  return Response.json({ ok:true })
}
