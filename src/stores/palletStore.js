import { defineStore } from "pinia";
import { setDoc, doc } from "firebase/firestore";
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from "./orderStore";
import { updateOrder } from "@/services/updates";

import { useOrders } from "@/services/supabaseFunctions/orders";

import { db } from "@/services/firebase";
import { v4 as uuidv4 } from 'uuid'; // Per generare un ID univoco
import QRCode from 'qrcode'; // Importa la libreria qrcode

export const usePalletStore = defineStore("palletStore", {
  state: () => ({
    orders: [],
    barcodes: [],
    palletId: null
  }),
  actions: {
    async closePallet() {
        const authStore = useAuthStore()

        try {
            const palletRef = doc(db, "pallets", this.palletId);

            await setDoc(palletRef, {
                barcodes: this.barcodeOrdersInPallet,
                palletStatus: "Closed",
                createdBy: authStore.user.uid,
                createdAt: new Date().toISOString()
            })

            const updatePromises = this.barcodeOrdersInPallet.map(barcode => 
                updateOrder(barcode, "Shipped by Sea", 1, this.palletId, null, null)
            );

            await Promise.all(updatePromises);
        } catch (error) {
            console.error('Errore durante la chiusura del bancale:', error);
            alert('Errore durante la chiusura del bancale.');
        }
    },
    
    defineID () {
        this.palletId = uuidv4()
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

        if (orderError || !orderData?.length) {
            console.error("Errore durante l'aggiunta dell’ordine:", orderError)
            return
        }

        this.orders.push(orderData[0])
        this.barcodes.push(orderData[0].barcode)
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
        this.barcodeOrdersInPallet = []
    }
  },
  persist: true,
});
