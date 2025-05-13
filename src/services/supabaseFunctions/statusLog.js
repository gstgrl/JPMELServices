// @ts-nocheck
import { supabase } from "../supabase"

export function useStatusLog() {
    const getLogs = async(barcode=null) => {
      const { data, error } = await supabase.from("order_status_logs").select("*").eq("barcode", barcode)
      return { data, error }
    }

    const createLog = async(logInfo) => {
      const { data, error } = await supabase.from("order_status_logs").insert([logInfo])
      return { data, error }
    }

  return {
    getLogs,
    createLog
  }
}
