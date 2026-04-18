import { getDB } from '../../../lib/db'
import dayjs from 'dayjs'
import { sendTelegram } from '../../../lib/telegram'

export async function GET() {
  const db = getDB()
  const { data } = await db.from('debts').select('*')

  for (const d of data) {
    const diff = dayjs(d.due_date).diff(dayjs(), 'day')

    if (diff === 3) await sendTelegram(`⚠️ ${d.name} 3 hari lagi`)
    if (diff === 1) await sendTelegram(`⏰ Besok ${d.name}`)
    if (diff === 0) await sendTelegram(`🔥 Hari ini ${d.name}`)
    if (diff < 0) await sendTelegram(`❌ Terlambat ${d.name}`)
  }

  return Response.json({ ok:true })
}
