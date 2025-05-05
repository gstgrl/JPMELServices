import { defineStore } from "pinia";
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from "./orderStore";
import { updateOrder } from "@/services/updates";

import { useOrders } from "@/services/supabaseFunctions/orders";
import { v4 as uuidv4 } from 'uuid'; // Per generare un ID univoco
import QRCode from 'qrcode'; // Importa la libreria qrcode
import { usePallets } from "@/services/supabaseFunctions/pallets";

export const usePalletStore = defineStore("palletStore", {
  state: () => ({
    orders: [],
    barcodes: [],
    palletId: null
  }),
  actions: {
    async closePallet() {
        if(!this.palletId) {
            const {data: palletData, error: palletError} = await usePallets().createPallet({status: 'Loading'})
            

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

    generateQrCode() {
        QRCode.toDataURL(this.palletId, { width: 200 }, (err, url) => {
            if (err) {
                console.error('Errore nella generazione del QR Code:', err);
                return;
            }
            
            // Puoi usare `url` per salvare l'immagine in Firebase o per scaricarla
            const link = document.createElement('a');
            link.href = url;
            link.download = 'pallet-qrcode.png';
            link.click();
            alert('QR Code generato e immagine scaricata!');
        })
    },

    async addOrder(barcode) {
        const { data: orderData, error: orderError } = await useOrders().getOrder(barcode, 1)
        const orderID = orderData.id

        if(orderError || !orderData) {
            console.error("Errore durante l'aggiunta dell’ordine:", orderError)
            return
        }

        this.orders.push(orderData)
        this.barcodes.push(orderData.barcode)
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
    }
  },
  persist: true,
});
