import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flhusbhwauxgkkolzksy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaHVzYmh3YXV4Z2trb2x6a3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTIyMzYsImV4cCI6MjA5MzAyODIzNn0.JUPDXJT_VEjo_QaKrVSP2rJlCS54iBWHDaa86vQ1_60'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)