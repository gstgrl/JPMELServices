// src/stores/orderStore.js
import { defineStore } from 'pinia';
import { db } from "@/services/firebase";
import { collection, getDoc, doc, increment, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    order: null
  }),

  actions: {
    //Funzione che ritorna il documento da Firebase con il codice a barre corrispondente facendo un controllo sulla validità dello statusCount
    async fetchOrderByBarcode(barcode, statusCount) {     
        try {
            const orderRef = doc(db, "packages", barcode);
            const orderDoc = await getDoc(orderRef); // Ottieni il documento
        
            if (orderDoc.exists()) {
                const data = orderDoc.data()

                if(data.statusCount === statusCount) {
                    this.order = data
                    return true
                }
            } else {
                console.error("Ordine non idoneo")
                return false
            }
        } catch (error) {
            console.error("Errore nel recupero del documento:", error);
            return false
        }
    },

    //Aggiorna lo stato dell'ordine aggiungendo un oggetto con data di modifica e nuovo stato nell'array statusHistory
    async updateStatusHistory(barcode, newStatus = null, palletId = null, deliveryStatus = null, incrementRate = null) {
        const orderRef = doc(db, "packages", barcode);
        const newStatusEntry = { date: new Date().toISOString(), status: newStatus };
        const updateData = {}

        if(newStatus) {updateData.statusHistory = arrayUnion(newStatusEntry)}

        if(incrementRate) {updateData.statusCount = increment(incrementRate)}

        if(palletId) {updateData.palletId = palletId}

        if(deliveryStatus) {updateData.deliveryStatus = deliveryStatus}

        try {
            await updateDoc(orderRef, updateData)
            console.log("Documento aggiornato correttamente !")
        } catch (error) {
            console.error("Errore nell'aggiornamento dello stato dell'articolo: ", error)
        }
    },

    //Aggiunge l'ordine corrente nel databse
    async addOrder(barcode, orderData) {
        const orderRef = doc(collection(db, "packages"), barcode)
        await setDoc(orderRef, {
            ...orderData,
            statusHistory: [{
                date: new Date().toISOString(),
                status: "Packaging"
            }],
            statusCount: 1
        })
    },

    resetOrder() {
        this.order = null
    }
  },

  persist: true,  // Abilita la persistenza dei dati, se necessario
});
