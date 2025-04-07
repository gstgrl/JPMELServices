import { defineStore } from "pinia";
import { getDoc, doc, updateDoc, where, query, getDocs, collection } from "firebase/firestore";

import { db } from "@/services/firebase";
import { useOrderStore } from "./orderStore";

export const useDeliveryPool = defineStore("deliveryPoolStore", {
  state: () => ({
    ordersPool: []
  }),
  actions: {
    addOrderToPool(barcode) {
      this.ordersPool.push(barcode)
    },

    removeOrderFromPool(barcode) {
       this.ordersPool = this.ordersPool.filter(item => item !== barcode);
    },

    resetPool() {
      this.ordersPool = []
    }
  },
  persist: true,
});
