import { getDB } from '../../../lib/db'
import { diffDays } from '../../../lib/utils'
import { sendTelegram } from '../../../lib/telegram'

export async function GET() {
  const db = getDB()
  const { data } = await db.from('debts').select('*, installments(*)')

  for (const d of data || []) {
    const next = d.installments.find(i => !i.is_paid)
    if (!next) continue

    const diff = diffDays(next.due_date)

    if (diff === 3) await sendTelegram(`⚠️ ${d.name} 3 hari lagi`)
    if (diff === 1) await sendTelegram(`⏰ Besok`)
    if (diff === 0) await sendTelegram(`🔥 Hari ini`)
    if (diff < 0) await sendTelegram(`❌ Terlambat`)
  }

  return Response.json({ ok: true })
}
