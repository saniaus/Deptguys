<div style={{ marginBottom: 10 }}>

  <input
    placeholder="Nama"
    onChange={e => setForm({
      ...form,
      name: e.target.value
    })}
  />

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
      name: form.name, // 🔥 sekarang pakai input user
      installmentAmount: form.installmentAmount,
      tenor: form.tenor,
      totalAmount: form.installmentAmount * form.tenor,
      dayOfMonth: form.dayOfMonth || 1,
      startDate: new Date().toISOString()
    })
  }}>
    Tambah
  </button>

</div>
