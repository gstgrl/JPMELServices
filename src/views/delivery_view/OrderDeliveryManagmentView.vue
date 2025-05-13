<script setup>
    import { computed } from 'vue';
    import { useDeliveryPool } from '@/stores/deliveryPoolStore';
    import { useRouter } from 'vue-router';
    import deliveryOrderCard from '@/views/delivery_view/deliveryOrderCard.vue';

    const deliveryPoolStore = useDeliveryPool()
    const router = useRouter()

    // Filtrare gli ordini con stato 'pending'
    const pendingOrders = computed(() => {
        return deliveryPoolStore.ordersPool.filter(order => order.delivery_status === 'warehouse');
    });

    const rescheduledOrders = computed(() => {
        return deliveryPoolStore.ordersPool.filter(order => order.delivery_status === 'rescheduled');
    });

    const deliveredOrders = computed(() => {
        return deliveryPoolStore.ordersPool.filter(order => order.delivery_status === 'delivered');
    });

    const toWarehouse = async() => {
        await deliveryPoolStore.returnToWarehouse()
        router.push('/warehouse')
    }
</script>

<template>
    <div class="container">
        <button class="btn btn-primary" @click="toWarehouse">
            Torna in magazzino
        </button>
    </div>
    <div class="container">
        <h6 class="order-title my-2">📦 {{ $t('delivery.titles.orderToDeliver') }}:</h6>
        <div v-for="(order, index) in pendingOrders" :key="index" class="order-item">
            <deliveryOrderCard :item="order"/>
        </div>

        <hr>

        <h6 class="order-title mb-2">📦 Ordini Riprogrammati:</h6> 
        <div v-for="(order, index) in rescheduledOrders" :key="index" class="order-item">
            <deliveryOrderCard :item="order"/>
        </div>

        <hr>

        <h6 class="order-title mb-2">📦 {{ $t('delivery.titles.orderDelivered') }}:</h6>
        <div v-for="(order, index) in deliveredOrders" :key="index" class="order-item">
            <deliveryOrderCard :item="order"/>
        </div>
    </div>
</template>