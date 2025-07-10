import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ugbsnlqopdgvpqlymonu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnYnNubHFvcGRndnBxbHltb251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjA3NTIsImV4cCI6MjA2NjczNjc1Mn0.xUog6pGk36amPsBkSSNRwXWm4eXWVPk0XDkwXAiOSrY'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export for use in other components
export default supabase 