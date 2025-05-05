// @ts-nocheck
import { supabase } from "../supabase"

export function useOrders() {
  const getOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*")
    return { data, error }
  }

  const getOrder = async (barcode, status=null) => {
    if(status) {
      const { data, error } = await supabase.from("orders").select("*").eq("barcode", barcode).eq("status", status).single()
      return { data, error }
    } else {
      const { data, error } = await supabase.from("orders").select("*").eq("barcode", barcode).single()
      return { data, error }
    }   
  }

  const createOrder = async (order) => {
    const { data, error } = await supabase.from("orders").insert([order]).select()
    return { data, error }
  }

  const updateOrder = async (id=null, barcode=null, updates) => {
    if(barcode) {
      const { data, error } = await supabase.from("orders").update(updates).eq("barcode", barcode)
      return { data, error }

    }else {
      const { data, error } = await supabase.from("orders").update(updates).eq("id", id)
      return { data, error }

    }
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
