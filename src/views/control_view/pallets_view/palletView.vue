<script setup>
    import { useOrders } from '@/services/supabaseFunctions/orders';
    import { ref, onMounted } from 'vue';
    import { useToastStore } from '@/stores/toastStore';
    import deliveryStatusBadge from './deliveryStatusBadge.vue';
    import offcanvaChanges from './offcanvaChanges.vue';
import { usePallets } from '@/services/supabaseFunctions/pallets';

    const toastStore = useToastStore()

    const pallets = ref([])
    const palletForOffcanva = ref({})

    onMounted(async() => {
        const {data: palletsData, error: fetchingError} = await usePallets().getPalletsWithBinding()
        if(fetchingError)  {
            toastStore.show("Error during fetching orders", 'warning')
            throw new Error(`Error during fetching orders: ${fetchingError.message}`)
        }

        for(let pallet of palletsData) {
            pallets.value.push(pallet)
        }
    })

    const sendInfoToOffcanva = (order) => {
        palletForOffcanva.value = order
    }

    const updateStatus = ({ id, status }) => {
        const index = orders.value.findIndex(o => o.id === id)
        if (index !== -1) {
            orders.value[index].status = status
        }
    }
</script>

<template>
    <div class="container">
        <div class="card my-2" v-for="(pallet) in pallets">
            <div class="card-header d-flex justify-content-between">
                <h5>ID: {{ pallet.id }}</h5>
                <h5><deliveryStatusBadge :status="pallet.status"/></h5>
            </div>

            <ul class="list-group card-body ps-3">
                <li v-for="(orderInfo) in pallet.orders" class="list-group-item">📄{{ orderInfo.barcode }} - 📦{{ orderInfo.package_number }}</li>
            </ul>
        </div>

        <offcanvaChanges :order="palletForOffcanva" @update-status="updateStatus"/>
    </div>
</template>

<style scoped>

    .button-custom {
        height: fit-content;
    }   

    .button-custom:disabled {
        height: fit-content;
        border: none;
    }

</style>