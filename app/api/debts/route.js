import { getDB } from '@/lib/db'
import { generateInstallments } from '@/lib/utils'

export async function GET() {
  const db = getDB()
  const { data } = await db.from('debts').select(`*, installments(*)`)
  return Response.json(data)
}

export async function POST(req) {
  const db = getDB()
  const body = await req.json()

  const installmentAmount = Math.ceil(body.totalAmount / body.tenor)

  const { data: debt } = await db
    .from('debts')
    .insert({
      name: body.name,
      total_amount: body.totalAmount,
      installment_amount: installmentAmount,
      tenor: body.tenor
    })
    .select()
    .single()

  const installments = generateInstallments(
    body.startDate,
    body.dayOfMonth,
    body.tenor,
    installmentAmount
  ).map(i => ({ ...i, debt_id: debt.id }))

  await db.from('installments').insert(installments)

  return Response.json({ ok: true })
}

export async function DELETE(req) {
  const db = getDB()
  const { id } = await req.json()
  await db.from('debts').delete().eq('id', id)
  return Response.json({ ok: true })
}
