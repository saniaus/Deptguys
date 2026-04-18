'use client'
import { useEffect, useState } from 'react'

const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY

export default function Page() {
  const [data, setData] = useState([])
  const [summary, setSummary] = useState({})
  const [form, setForm] = useState({})

  async function load() {
    const d = await fetch('/api/debts').then(r => r.json())
    const s = await fetch('/api/summary').then(r => r.json())
    setData(d)
    setSummary(s)
  }

  async function add(payload) {
    await fetch('/api/debts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': KEY
      },
      body: JSON.stringify(payload)
    })
    load()
  }

  async function pay(installmentId, debtId) {
    await fetch('/api/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': KEY
      },
      body: JSON.stringify({ installmentId, debtId })
    })
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{padding:20}}>

      <h2>Total: Rp{summary.total_all}</h2>
      <h3>Sisa: Rp{summary.total_remaining}</h3>

      <input placeholder="Cicilan per bulan"
        onChange={e => setForm({...form, installmentAmount:Number(e.target.value)})}/>

      <input placeholder="Tenor"
        onChange={e => setForm({...form, tenor:Number(e.target.value)})}/>

      <input placeholder="Tanggal (1-28)"
        onChange={e => setForm({...form, dayOfMonth:Number(e.target.value)})}/>

      <button onClick={() => {
        add({
          installmentAmount: form.installmentAmount,
          tenor: form.tenor,
          dayOfMonth: form.dayOfMonth || 1,
          startDate: new Date().toISOString()
        })
      }}>
        Tambah
      </button>

      {data.map(d => {
        const sisa = d.total_amount - (d.installment_amount * d.paid_count)

        return (
          <div key={d.id} style={{border:'1px solid #ccc', margin:10, padding:10}}>

            <b>{d.name}</b><br/>
            Cicilan: Rp{d.installment_amount}<br/>
            Tenor: {d.tenor}<br/>
            Total: Rp{d.total_amount}<br/>
            Sisa: Rp{sisa}<br/>
            Tanggal: tiap {new Date(d.installments[0]?.due_date).getDate()}<br/>

            {d.installments.map(i => (
              <div key={i.id}>
                {new Date(i.due_date).toLocaleDateString()}
                - Rp{i.amount}

                {!i.is_paid && (
                  <button onClick={() => pay(i.id, d.id)}>
                    Bayar
                  </button>
                )}

                {i.is_paid && ' ✅'}
              </div>
            ))}

          </div>
        )
      })}

    </div>
  )
}
