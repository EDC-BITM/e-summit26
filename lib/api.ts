import axios from "axios"


// Create an Axios instance to interact with Supabase RESTful API
const apiClient_db = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "apikey": process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY}`,
    "Prefer":"return=minimal" 
  },
})

export default apiClient_db