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

    load() // 🔥 update langsung setelah bayar
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div style={{ padding: 20 }}>

      <h2>Total: Rp{summary.total_all || 0}</h2>
      <h3>Sisa: Rp{summary.total_remaining || 0}</h3>

      {/* FORM INPUT */}
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Cicilan per bulan"
          onChange={e => setForm({
            ...form,
            installmentAmount: Number(e.target.value)
          })}
        />

        <input
          placeholder="Tenor"
          onChange={e => setForm({
            ...form,
            tenor: Number(e.target.value)
          })}
        />

        <input
          placeholder="Tanggal (1-28)"
          onChange={e => setForm({
            ...form,
            dayOfMonth: Number(e.target.value)
          })}
        />

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
      </div>

      {/* 🔥 TABEL UTAMA */}
      <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Cicilan</th>
            <th>Tenor</th>
            <th>Total</th>
            <th>Sisa</th>
            <th>Tanggal</th>
            <th>Notif Keluar</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map(d => {
            const sudahDibayar = d.installment_amount * d.paid_count
            const sisa = d.total_amount - sudahDibayar

            const tanggal = d.installments[0]
              ? new Date(d.installments[0].due_date).getDate()
              : '-'

            const next = d.installments.find(i => !i.is_paid)

            return (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>Rp{d.installment_amount}</td>
                <td>{d.tenor}</td>
                <td>Rp{d.total_amount}</td>

                {/* 🔥 SISA */}
                <td style={{ color: sisa > 0 ? 'red' : 'green' }}>
                  Rp{sisa}
                </td>

                <td>{tanggal}</td>

                <td>
                  {next
                    ? new Date(next.due_date).toLocaleDateString()
                    : 'Lunas'}
                </td>

                <td>
                  {next ? (
                    <button onClick={() => pay(next.id, d.id)}>
                      Bayar
                    </button>
                  ) : (
                    '✔'
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

    </div>
  )
}
