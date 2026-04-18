import dayjs from 'dayjs'

export function generateInstallments(startDate, dayOfMonth, tenor, amount) {
  const arr = []
  let base = dayjs(startDate)

  for (let i = 0; i < tenor; i++) {
    arr.push({
      due_date: base.add(i, 'month').date(dayOfMonth).toISOString(),
      amount
    })
  }

  return arr
}

export function diffDays(date) {
  return dayjs(date).diff(dayjs(), 'day')
}
