// src/composables/useOrders.js
import { supabase } from "../supabase"
import { ref } from "vue"

export function useClients() {

  const error = ref(false)
  const loading = ref(false)
  const clients = ref([])


  const getClients = async () => {
    const { data, error } = await supabase.from('clients').select('*')
    return { data, error }
  }

  const getClientsByName = async (name) => {
    loading.value = true

    const { data, error: err } = await supabase
      .from('clients')
      .select('*')
      .ilike('name', `%${name}%`)  // Operatore LIKE per ricerca case-insensitive

    loading.value = false

    if (err) {
      error.value = err
      console.error('Errore durante la ricerca dei clienti:', err)
    }

    return { data, error: err }
  }

  const getClient = async (id) => {
    const { data, error } = await supabase.from('clients').eq('id', id)
    return { data, error }
  }

  const createClient = async (client) => {
    const { data, error } = await supabase.from('clients').insert([client])
    return { data, error }
  }

  const updateClient = async (id, updates) => {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', id)
    return { data, error }
  }

  const deleteClient = async (id) => {
    const { data, error } = await supabase.from('clients').delete().eq('id', id)
    return { data, error }
  }

  return {
    getClients,
    getClientsByName,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    loading, clients, error
  }
}