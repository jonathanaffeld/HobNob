import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://atyhlvlelknxikxvyroy.supabase.co'
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eWhsdmxlbGtueGlreHZ5cm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNzc1MjksImV4cCI6MjAzMDk1MzUyOX0.DFfowmyO0RgS6Rx-Z9f6ILRwrWWDjcFBjMHkRnA5SJA
const supabase = createClient(supabaseUrl, supabaseKey)