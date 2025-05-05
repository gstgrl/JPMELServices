// @ts-nocheck
import { supabase } from "../supabase"

export function usePallets() {
  const getPallets = async () => {
    const { data, error } = await supabase.from("pallets").select("*")
    return { data, error }
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

  return {
    getPallets,
    getPallet,
    createPallet,
    updatePallet,
    deletePallet
  }
}
