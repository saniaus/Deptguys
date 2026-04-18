import { createClient } from '@supabase/supabase-js'

export function getDB() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE

  if (!url || !key) {
    throw new Error('Missing ENV')
  }

  return createClient(url, key)
}
