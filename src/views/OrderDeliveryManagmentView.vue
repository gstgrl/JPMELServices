<script setup>
    import { ref, computed } from 'vue';
    import { useDeliveryPool } from '@/stores/deliveryPoolStore';
    import deliveryOrderCard from '@/components/deliveryOrderCard.vue';

    const deliveryPoolStore = useDeliveryPool()

    // Filtrare gli ordini con stato 'pending'
    const pendingOrders = computed(() => {
        return deliveryPoolStore.ordersPoolItem.filter(order => order.data.deliveryStatus === 'pending');
    });

    const deliveredOrders = computed(() => {
        return deliveryPoolStore.ordersPoolItem.filter(order => order.data.deliveryStatus === 'delivered');
    });

    const rescheduledOrders = computed(() => {
        return deliveryPoolStore.ordersPoolItem.filter(order => order.data.deliveryStatus === 'rescheduled');
    });
</script>

<template>
    <div class="container">
        <h6 class="order-title my-2">📦 {{ $t('delivery.titles.orderToDeliver') }}:</h6>
        <div v-for="(order, index) in pendingOrders" :key="index" class="order-item">
            <deliveryOrderCard :item="order" />
        </div>

        <hr>

        <h6 class="order-title mb-2">📦 Ordini Riprogrammati:</h6> 

        <div v-for="(order, index) in rescheduledOrders" :key="index" class="order-item">
            <deliveryOrderCard :item="order" />
        </div>

        <hr>

        <h6 class="order-title mb-2">📦 {{ $t('delivery.titles.orderDelivered') }}:</h6>

        <div v-for="(order, index) in deliveredOrders" :key="index" class="order-item">
            <deliveryOrderCard :item="order" />
        </div>
    </div>
</template>