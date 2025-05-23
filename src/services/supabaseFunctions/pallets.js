// @ts-nocheck
import { supabase } from "../supabase"

export function usePallets() {
  const getPallets = async (status=null) => {
    if(status) {
      const { data, error } = await supabase.from("pallets").select("*").eq("status", status)
      return { data, error }

    } else {
      const { data, error } = await supabase.from("pallets").select("*")
      return { data, error }
    }
  }

  const getPallet = async (id) => {
    const { data, error } = await supabase.from("pallets").eq("id", id)
    return { data, error }
  }

  const createPallet = async (palletInfo) => {
    const { data, error } = await supabase.from("pallets").insert([palletInfo]).select().single()
    return { data, error }
  }

  const updatePallet = async (id, updates) => {
    const { data, error } = await supabase.from("pallets").update(updates).eq("id", id)
    return { data, error }
  }

  const deletePallet = async (id) => {
    const { data, error } = await supabase.from("pallets").delete().eq("id", id)
    return { data, error }
  }

  const returnPalletStatus = async (id) => {
    const { data, error } = await supabase.from("pallets").select("*").eq("id", id).single()

    if(error) {
      console.error("Errore nel recupero del pallet:", error)
      return
    }

    return data?.status === 'closed'
  }

  return {
    getPallets,
    getPallet,
    createPallet,
    updatePallet,
    deletePallet,
    returnPalletStatus
  }
}
