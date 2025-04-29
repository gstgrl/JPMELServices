import { defineStore } from "pinia";
import { useOrderStore } from "./orderStore";
import { updateOrder } from "@/services/updates";

export const useDeliveryPool = defineStore("deliveryPoolStore", {
  state: () => ({
    ordersPool: [], //Array di barcodes, indica quali ordini sono presenti per la consegna
    orderNumber: 0,

    //Fase di consegna
    onDelivery: false, 
    ordersPoolItem: []
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

    async startDelivery() {
      const orderStore = useOrderStore()

      for (const barcode of this.ordersPool) {
        try {
          const found = await orderStore.fetchOrderByBarcode(barcode, 3);
      
          if (found) {
            const order = { data: orderStore.order, barcode };
            await updateOrder(barcode, 'In delivery', 1, null, null, null)
            orderStore.resetOrder();
            this.ordersPoolItem.push(order);

          } else {
            console.warn(`⚠️ Ordine non trovato per il barcode: ${barcode}`);
          }
        } catch (error) {
          console.error(`❌ Errore durante il processo per ${barcode}:`, error);
        }
      }
      this.ordersPool = []
      this.onDelivery = true
      this.orderNumber = 0
    },

    async updateBadgeStatusOrder(order, newStatus, incrementRate, deliveryStatus, signature) {

      const index = this.ordersPoolItem.findIndex(item => item.barcode === order.barcode)

      if(index != -1) {
        this.ordersPoolItem[index].data.deliveryStatus = deliveryStatus
        await updateOrder(order.barcode, newStatus, incrementRate, null, deliveryStatus, signature)
      }
    },

    async orderDeliveredFunction(order, signature) {
      await this.updateBadgeStatusOrder(order, "Delivered", 1, 'delivered', signature)
    },

    async orderRescheduled(order) {
      await this.updateBadgeStatusOrder(order, 'Rescheduled', -1, 'rescheduled', null)
    },

    async orderReturned(order) {
      await this.updateBadgeStatusOrder(order, 'Returned to Warehouse', -1, 'pending', null)
    },

    async returnToWarehouse() {
      this.onDelivery = false

      for(const item of this.ordersPoolItem) {
        if(item.data.deliveryStatus == 'pending') {
          await this.orderRescheduled(item)
        }
      }

      this.ordersPoolItem = [];
    },

    resetPool() {
      this.ordersPool = [];
      this.orderNumber = 0;
      this.onDelivery = false;
      this.ordersPoolItem = [];
    }
  },
  persist: true
});
