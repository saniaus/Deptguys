'use client'

import { useEffect, useState } from 'react'

const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY

export default function Page() {
  const [data, setData] = useState([])
  const [summary, setSummary] = useState({ total_all: 0, total_remaining: 0 })
  const [form, setForm] = useState({})

  async function load() {
    const d = await fetch('/api/debts').then(r => r.json())
    const s = await fetch('/api/summary').then(r => r.json())
    setData(d)
    setSummary(s)
  }

  async function add() {
    await fetch('/api/debts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': KEY
      },
      body: JSON.stringify(form)
    })
    load()
  }

  async function pay(i, d) {
    await fetch('/api/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': KEY
      },
      body: JSON.stringify({ installmentId: i, debtId: d })
    })
    load()
  }

  async function del(id) {
    await fetch('/api/debts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': KEY
      },
      body: JSON.stringify({ id })
    })
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Total: Rp{summary.total_all}</h2>
      <h3>Sisa: Rp{summary.total_remaining}</h3>

      <input placeholder="Nama"
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Total"
        onChange={e => setForm({ ...form, totalAmount: Number(e.target.value) })} />

      <input placeholder="Tenor"
        onChange={e => setForm({ ...form, tenor: Number(e.target.value) })} />

      <input placeholder="Tanggal (1-28)"
        onChange={e => setForm({ ...form, dayOfMonth: Number(e.target.value) })} />

      <input type="date"
        onChange={e => setForm({ ...form, startDate: e.target.value })} />

      <button onClick={add}>Tambah</button>

      {data.map(d => (
        <div key={d.id}>
          <h4>{d.name}</h4>
          <button onClick={() => del(d.id)}>Hapus</button>

          {d.installments.map(i => (
            <div key={i.id}>
              {new Date(i.due_date).toLocaleDateString()} - Rp{i.amount}
              {!i.is_paid
                ? <button onClick={() => pay(i.id, d.id)}>Bayar</button>
                : ' ✅'}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
