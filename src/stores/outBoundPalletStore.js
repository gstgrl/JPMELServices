import { defineStore } from "pinia";
import { updateDoc, setDoc, getDoc, doc } from "firebase/firestore";
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from "./orderStore";

import { db } from "@/services/firebase";
import { v4 as uuidv4 } from 'uuid'; // Per generare un ID univoco
import QRCode from 'qrcode'; // Importa la libreria qrcode

export const usePalletStore = defineStore("outBoundPallet", {
  state: () => ({
    orders: [],
    palletId: null,
    barcodeOrdersInPallet: [] //I barcode corrispondenti agli ordini presenti nel bancale
  }),
  actions: {
    async closePallet() {
        const orderStore = useOrderStore()
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
                orderStore.updateStatusHistory(barcode, "Shipped By Sea", this.palletId, null, 1)
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

    async addOrder(barcode, statusCount = null ,orderData = null) {
        const orderStore = useOrderStore()

        if(orderData) {
            //Se ho gia l'articolo, lo aggiungo soltanto al bancale
            const temporaryOrder = {
                ...orderData,
                barcodeValue: barcode
            }
            this.orders.push(temporaryOrder)
            this.barcodeOrdersInPallet.push(barcode)

        } else {
            //Se voglio aggiungere un articolo dovendolo recuperare dal database
            await orderStore.fetchOrderByBarcode(barcode, statusCount).then((result) => {
                if(result) {
                    const temporaryOrder = {
                        ...orderStore.order,
                        barcodeValue: barcode
                    }
                    this.orders.push(temporaryOrder)
                    this.barcodeOrdersInPallet.push(barcode)
        
                    orderStore.resetOrder()
                } else {
                    window.alert("Impossibile aggiungere questo ordine al bancale")
                }
            })
        }
    },

    checkAlreadyIn(barcode) {
        return this.barcodeOrdersInPallet.includes(barcode)
    },

    removeOrder(barcode) {
        this.orders = this.orders.filter(item => item.barcodeValue != barcode)
        this.barcodeOrdersInPallet = this.barcodeOrdersInPallet.filter(item => item != barcode)
    },

    resetPalletStore() {
        this.orders = []
        this.palletId = null
        this.barcodeOrdersInPallet = []
    }
  },
  persist: true,
});
