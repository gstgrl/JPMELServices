import { defineStore } from "pinia";
import { useOrderStore } from "./orderStore";

export const useDeliveryPool = defineStore("deliveryPoolStore", {
  state: () => ({
    ordersPool: [],
    orderNumber: 0,
    onDelivery: false
  }),
  actions: {
    addOrderToPool(barcode) {
      this.orderNumber++;
      this.ordersPool.push(barcode)
    },

    removeOrderFromPool(barcode) {
      this.orderNumber--;
      this.ordersPool = this.ordersPool.filter(item => item !== barcode);
    },

    async startDeliverying() {
      const orderStore = useOrderStore()

      await Promise.all(
        this.ordersPool.map(async (barcode) => {
            try {
              const found = await orderStore.fetchOrderByBarcode(barcode, 3);
              if (found) {
                await orderStore.updateStatusHistory(barcode, "On delivery", null);

              } else {
                console.warn(`⚠️ Ordine non trovato per il barcode: ${barcode}`);
              }

            } catch (error) {
              console.error(`Errore nel recupero dell'ordine con barcode ${barcode}:`, error);
            }
        })
      );

      this.onDelivery = true
      this.orderNumber = 0
    },

    resetPool() {
      this.ordersPool = [];
      this.orderNumber = 0;
      this.onDelivery = false
    }
  },
  persist: true
});
