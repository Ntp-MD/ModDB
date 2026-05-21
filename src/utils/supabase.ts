import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ufehgfdygrtgsuqlmeii.supabase.co'
const supabaseAnonKey = 'sb_publishable_YwbAIpZMfpove2GTvuCkSw_ARKehVpv'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
