import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zuycrniapawpvftwimnp.supabase.co'
const SUPABASE_KEY = 'sb_publishable_fPhyY6jlxJW7_qlYDJpUog_0xpra_m6'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
