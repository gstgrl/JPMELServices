// @ts-nocheck
import { supabase } from "../supabase"

export function useOrders() {
  const getOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*")
    return { data, error }
  }

  const getOrder = async (barcode, status) => {
    const { data, error } = await supabase.from("orders").select("*").eq("barcode", barcode).eq("status", status)
    return { data, error }
  }

  const createOrder = async (order) => {
    const { data, error } = await supabase.from("orders").insert([order]).select()
    return { data, error }
  }

  const updateOrder = async (id, updates) => {
    const { data, error } = await supabase.from("orders").update(updates).eq("id", id)
    return { data, error }
  }

  const deleteOrder = async (id) => {
    const { data, error } = await supabase.from("orders").delete().eq("id", id)
    return { data, error }
  }

  return {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
  }
}
