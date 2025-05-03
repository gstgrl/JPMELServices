import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hvyluifepdnsziifbnla.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eWx1aWZlcGRuc3ppaWZibmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzUxNjIsImV4cCI6MjA2MTUxMTE2Mn0.DgJbazjkvJf8UAZU0T4L7TJF84wXgPQyrb4_wUVkGbk'

export const supabase = createClient(supabaseUrl, supabaseKey)
