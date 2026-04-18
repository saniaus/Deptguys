export async function sendTelegram(text) {
  await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      chat_id: process.env.TG_CHAT_ID,
      text
    })
  })
}
