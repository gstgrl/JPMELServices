import { defineStore } from "pinia";
import { useOrders } from "@/services/supabaseFunctions/orders";
import { usePallets } from "@/services/supabaseFunctions/pallets";

export const usePalletStore = defineStore("palletStore", {
  state: () => ({
    availableOrders: [],
    orders: [],
    barcodes: [],
    palletId: null,
    orderChecked: {}
  }),
  actions: {
    async closePallet() {
        if(!this.palletId) {
            const {data: palletData, error: palletError} = await usePallets().createPallet({status: 'Closed'})
            if(palletError || !palletData)  throw new Error(`Error during pallet creation action: ${palletError.message}`)

            this.palletId = palletData.id
        } 

        for (let barcode of this.barcodes) {
            const {data: orders, error: ordersError} = await useOrders().updateOrder(null, barcode, {'pallet_id': this.palletId, 'status': 2})
            if(ordersError)  throw new Error(`Error during order update: ${ordersError.message}`)
        }
    },

    async addOrder(order) {
        this.orders.push(order)
        this.barcodes.push(order.barcode)
    },

    checkAvailability(barcodeToCheck) {
        const exists = this.availableOrders.some(order => order.barcode === barcodeToCheck);
        
        if(exists) {
            return true
        } else {
            return false
        }
    },

    checkAlreadyIn(barcode) {
        return this.barcodes.includes(barcode)
    },

    removeOrder(barcode) {
        this.orders = this.orders.filter(item => item.barcode != barcode)
        this.barcodes = this.barcodes.filter(item => item != barcode)
    },

    resetPalletStore() {
        this.orders = []
        this.palletId = null
        this.barcodes = []
        this.availableOrders = []
        this.orderChecked = {}   
    }
  },
  persist: true
});
