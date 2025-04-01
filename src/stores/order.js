// src/stores/orderStore.js
import { defineStore } from 'pinia';
import { db } from "@/services/firebase";
import { collection, query, where, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
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

    setOrder(name, surname, address, province, city, phoneNumber, barcodeValue) {
      this.item = {
        name: name,
        surname: surname,
        address: address,
        province: province,
        city: city,
        phoneNumber: phoneNumber,
        barcodeValue: barcodeValue
      };
    },

    async saveOrderOnDB() { //Mi salva l'ordine nel database
      const orderRef = doc(collection(db, "packages"), this.item.barcodeValue)
      const orderData = {
        statusHystory: [{
          date: new Date().toISOString(),
          status: "Packaging"
        }],
        statusCount: 1,
        name: this.item.name,
        surname: this.item.surname,
        address: this.item.address,
        province: this.item.province,
        city: this.item.city,
        phoneNumber: this.item.phoneNumber
      }

      await setDoc(orderRef, orderData)
    },

    // Verifica se tutti i campi sono stati riempiti
    isOrderValid() {
      const o = this.item;
      return o.name !== '' && o.surname !== '' && o.address !== '' && o.province !== '' && o.city !== '' && o.phoneNumber !== '';
    }
  },

  persist: true  // Abilita la persistenza dei dati, se necessario
});
