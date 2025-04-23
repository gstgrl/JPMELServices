// src/stores/orderStore.js
import { defineStore } from 'pinia';
import { db } from "@/services/firebase";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";

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
