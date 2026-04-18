import { getDB } from '../../../lib/db'

export async function GET() {
  const db = getDB()
  const { data } = await db.from('debts').select('*')
  return Response.json(data)
}

export async function POST(req) {
  const db = getDB()
  const body = await req.json()

  await db.from('debts').insert({
    name: body.name,
    total: body.total,
    remaining: body.total,
    due_date: body.due_date
  })

  return Response.json({ ok:true })
}

export async function DELETE(req) {
  const db = getDB()
  const { id } = await req.json()

  await db.from('debts').delete().eq('id', id)

  return Response.json({ ok:true })
}
