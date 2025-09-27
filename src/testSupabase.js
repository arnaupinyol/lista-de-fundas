import { supabase } from '../lib/supabaseClient'

async function testConnection() {
  const { data, error } = await supabase.from('informacion').select('*')
  console.log('Data:', data)
  console.log('Error:', error)
}

testConnection()
