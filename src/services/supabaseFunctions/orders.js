// @ts-nocheck
import { supabase } from "../supabase"

export function useOrders() {
  const getOrders = async (status=null, palletID=null) => {
    if(status) {
      const { data, error } = await supabase.from("orders").select("*").eq("status", status)
      return { data, error }

    } else if(palletID) {
      const { data, error } = await supabase.from("orders").select("*").eq("pallet_id", palletID)
      return { data, error }

    } else if(palletID && status) {
      const { data, error } = await supabase.from("orders").select("*").eq("pallet_id", palletID).eq("status", status)
      return { data, error }

    } else {
      const { data, error } = await supabase.from("orders").select("*")
      return { data, error }
    }
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
    const { data, error } = await supabase.from("orders").insert([order]).select().single()
    return { data, error }
  }

  const updateOrder = async (id=null, barcode=null, palletID=null, updates) => {
    if(barcode) {
      const { data, error } = await supabase.from("orders").update(updates).eq("barcode", barcode).select().single()
      return { data, error }

    } else if(palletID) {
      const { data, error } = await supabase.from("orders").update(updates).eq("pallet_id", palletID).select()
      return { data, error }

    } else  {
      const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single()
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
