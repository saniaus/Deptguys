'use client'
import { useEffect, useState } from 'react'

const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY

export default function Page() {
  const [data, setData] = useState([])
  const [form, setForm] = useState({})

  async function load() {
    const d = await fetch('/api/debts').then(r => r.json())
    setData(d)
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

  async function pay(id, amount) {
    await fetch('/api/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': KEY
      },
      body: JSON.stringify({ id, amount })
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
    <div style={{padding:20}}>

      <h2>Data Hutang</h2>

      {/* FORM */}
      <input placeholder="Nama"
        onChange={e => setForm({...form, name:e.target.value})} />

      <input placeholder="Total Hutang"
        onChange={e => setForm({...form, total:Number(e.target.value)})} />

      <input type="date"
        onChange={e => setForm({...form, due_date:e.target.value})} />

      <button onClick={add}>Tambah</button>

      {/* TABEL */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Total</th>
            <th>Sisa</th>
            <th>Jatuh Tempo</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>Rp{d.total}</td>
              <td style={{color:d.remaining > 0 ? 'red':'green'}}>
                Rp{d.remaining}
              </td>
              <td>{new Date(d.due_date).toLocaleDateString()}</td>

              <td>
                <button onClick={() => pay(d.id, 100000)}>
                  Bayar 100rb
                </button>

                <button onClick={() => del(d.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}
