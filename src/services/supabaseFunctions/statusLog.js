// @ts-nocheck
import { supabase } from "../supabase"

export function useStatusLog() {
    const getLogs = async(barcode=null, orderID=null) => {
      if(barcode) {
        const { data, error } = await supabase.from("order_status_logs").select("*").eq("barcode", barcode)
        return { data, error }

      }
      
      if(orderID) {
        const { data, error } = await supabase.from("order_status_logs").select("*").eq("order_id", orderID)
        return { data, error }
      }
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
