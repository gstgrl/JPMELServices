// src/stores/orderStore.js
import { defineStore } from 'pinia';
import { db } from "@/services/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export const useOrder = defineStore('orderStore', {
  state: () => ({
    // Oggetto che rappresenta l'ordine
    item: {
      name: '',
      surname: '',
      address: '',
      province: '',
      city: '',
      phoneNumber: '',
      barcodeValue: ''
    }
  }),

  actions: {
    // Resetta l'oggetto `order` a valori predefiniti
    resetOrder() {
      this.item = {
        name: '',
        surname: '',
        address: '',
        province: '',
        city: '',
        phoneNumber: '',
        barcodeValue: ''
      };
    },

    async saveOrderOnDB() { //Mi salva l'ordine nel database, attualmente Firebase
        await addDoc(collection(db, "packages"), {
            barcodeValue: this.item.barcodeValue,
            statusHystory: [{
              date: new Date().toISOString(),
              status: "Packaging"
            }]
        });
    },

    async findOrder(barcode) { //Mi trova l'ordine con il suo rispettivo codice a barre
        const q = query(collection(db, "packages"), where("barcodeValue", "==", barcode));

        try {
            const querySnapshot = await getDocs(q);
        
            if (querySnapshot.empty) {
                window.alert("Nessun prodotto trovato con il codice a barre:", barcode);
                return false
            } else {
                // Itera sui documenti trovati e restituisci il risultato
                querySnapshot.forEach((doc) => {
                    const product = doc.data();

                    // ✅ Aggiorna correttamente l'oggetto item
                    this.item = { ...product };
                });
                return true
            }
        } catch (error) {
            console.error("Errore durante la ricerca del prodotto:", error);
            return false
        }
    },

    // Verifica se tutti i campi sono stati riempiti
    isOrderValid() {
      const o = this.item;
      return o.name !== '' && o.surname !== '' && o.address !== '' && o.province !== '' && o.city !== '' && o.phoneNumber !== '';
    }
  },

  persist: true  // Abilita la persistenza dei dati, se necessario
});
