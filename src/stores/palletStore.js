import { defineStore } from "pinia";
import { ref } from "vue";
import { useOrders } from "@/services/supabaseFunctions/orders";
import { usePallets } from "@/services/supabaseFunctions/pallets";
import QRCode from 'qrcode'; // Importa la libreria qrcode

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
            

            if(palletError || !palletData) {
                console.error("Errore durante la creazione del bancale", palletError)
                return
            }

            this.palletId = palletData.id
        } 

        for (let barcode of this.barcodes) {
            const {data: orders, error: ordersError} = await useOrders().updateOrder(null, barcode, {'pallet_id': this.palletId, 'status': 2})

            if (ordersError) {
                console.error(`Errore nell'aggiornamento dell'ordine ${barcode}:`, ordersError);
            } else {
                console.log(`Ordine ${barcode} aggiornato con successo.`);
            }
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
