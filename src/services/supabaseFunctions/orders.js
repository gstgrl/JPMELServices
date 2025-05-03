// src/composables/useOrders.js
import { supabase } from "../supabase"

export function useOrders() {
  const getOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*')
    return { data, error }
  }

  const getOrder = async (id) => {
    const { data, error } = await supabase.from('orders').eq('id', id)
    return { data, error }
  }

  const createOrder = async (order) => {
    const { data, error } = await supabase.from('orders').insert([order])
    return { data, error }
  }

  const updateOrder = async (id, updates) => {
    const { data, error } = await supabase.from('orders').update(updates).eq('id', id)
    return { data, error }
  }

  const deleteOrder = async (id) => {
    const { data, error } = await supabase.from('orders').delete().eq('id', id)
    return { data, error }
  }

  return {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder
  }
}
