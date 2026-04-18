import { getDB } from '../../../lib/db'
import { generateInstallments } from '../../../lib/utils'

export async function GET() {
  const db = getDB()

  const { data } = await db
    .from('debts')
    .select('*, installments(*)')
    .order('created_at', { ascending: false })

  return Response.json(data || [])
}

export async function POST(req) {
  const db = getDB()
  const body = await req.json()

  if (!body.name || !body.totalAmount || !body.tenor) {
    return new Response('Invalid input', { status: 400 })
  }

  const installmentAmount = Math.ceil(body.totalAmount / body.tenor)

  const { data: debt, error } = await db
    .from('debts')
    .insert({
      name: body.name,
      total_amount: body.totalAmount,
      installment_amount: installmentAmount,
      tenor: body.tenor
    })
    .select()
    .single()

  if (error) return new Response(error.message, { status: 500 })

  const installments = generateInstallments(
    body.startDate,
    body.dayOfMonth,
    body.tenor,
    installmentAmount
  ).map(i => ({
    ...i,
    debt_id: debt.id
  }))

  await db.from('installments').insert(installments)

  return Response.json({ ok: true })
}
