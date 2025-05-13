import { defineStore } from "pinia";
import { useOrders } from '@/services/supabaseFunctions/orders'
import { useStatusLog } from '@/services/supabaseFunctions/statusLog'
import { useToastStore } from "./toastStore";

export const useDeliveryPool = defineStore("deliveryPoolStore", {
  state: () => ({
    ordersPool: [], //Array di barcodes, indica quali ordini sono presenti per la consegna
  }),
  actions: {
    async startDelivery(orders) {
      const toastStore = useToastStore()

      for(let order of orders) {
        const {data: dataOrder, error: errorUpdate} = await useOrders().updateOrder(null, order.barcode, null, {status: 4})
        if(errorUpdate)  {
          toastStore.show('Error during returning order to warehouse', 'danger')
          throw new Error(`Error during returning order to warehouse: ${errorUpdate.message}`)
        }

        //Creo un nuovo log di stato avanzamento consegna
        const {data: log, error: errorLog} = await useStatusLog().createLog({order_id: dataOrder.id, barcode: order.barcode, status: 'In delivery'})
        if(errorLog)  {
          toastStore.show('Error during creating order delivery status history log', 'danger')
          throw new Error(`Error during creating order delivery status history log: ${errorLog.message}`)
        }

        this.ordersPool.push(order)
      }
    },

    async returnToWarehouse() {
      const toastStore = useToastStore()

      for(let order of this.ordersPool) {
        if(order.delivery_status != 'delivered') {
          const {data: dataOrder, error: errorUpdate} = await useOrders().updateOrder(null, order.barcode, null, {status: 3})
          if(errorUpdate)  {
            toastStore.show('Error during returning order to warehouse', 'danger')
            throw new Error(`Error during returning order to warehouse: ${errorUpdate.message}`)
          }

          //Creo un nuovo log di stato avanzamento consegna
          const {data: log, error: errorLog} = await useStatusLog().createLog({order_id: dataOrder.id, barcode: order.barcode, status: 'Returned to Warehouse'})
          if(errorLog)  {
            toastStore.show('Error during creating order delivery status history log', 'danger')
            throw new Error(`Error during creating order delivery status history log: ${errorLog.message}`)
          }
        }
      }
      
      this.resetPinia()
    },

    updateBadge(barcode, deliveryStatus) {
      const index = this.ordersPool.findIndex(item => item.barcode === barcode)

      if(index != -1) {
        this.ordersPool[index].delivery_status = deliveryStatus
      }
    },

    async orderDelivered(barcode) {
      const toastStore = useToastStore()

      //Aggiorno lo stato dell'ordine 
      const {data: dataOrder, error: errorUpdate} = await useOrders().updateOrder(null, barcode, null, {status: 5})
      if(errorUpdate)  {
        toastStore.show('Error during updating order', 'danger')
        throw new Error(`Error during updating order: ${errorUpdate.message}`)
      }

      //Creo un nuovo log di stato avanzamento consegna
      const {data: log, error: errorLog} = await useStatusLog().createLog({order_id: dataOrder.id, barcode: barcode, status: 'Delivered'})
      if(errorLog)  {
        toastStore.show('Error during creating order delivery status history log', 'danger')
        throw new Error(`Error during creating order delivery status history log: ${errorLog.message}`)
      }
      
    },

    resetPinia() {
      this.ordersPool = []
    }
  },
  persist: true
});
