<script setup>
    import { ref, onMounted } from 'vue';
    import { useToastStore } from '@/stores/toastStore';
    import { usePallets } from '@/services/supabaseFunctions/pallets';
    import { useOrders } from '@/services/supabaseFunctions/orders';
    import deliveryStatusBadge from './deliveryStatusBadge.vue';

    const toastStore = useToastStore()

    const pallets = ref([])

    onMounted(async() => {
        const {data: palletsData, error: fetchingError} = await usePallets().getPalletsWithBinding()
        if(fetchingError)  {
            toastStore.show("Error during fetching orders", 'warning')
            throw new Error(`Error during fetching orders: ${fetchingError.message}`)
        } console.log(palletsData)

        for(let pallet of palletsData) {
            pallets.value.push(pallet)
        }
    })

    const handleDeletingOrder = async(order_id, pallet_id) => {
        for(const pallet of pallets.value) {
            if(pallet.id == pallet_id) {
                pallet.orders = pallet.orders.filter( item => item.id !== order_id)

                const {data: dataOrder, error: errorUpdate} = await useOrders().updateOrder(order_id, null, null, {pallet_id: null, status: 1})
                if(errorUpdate)  {
                    toastStore.show('Error during update order info', 'danger')
                    throw new Error(`Error during update order info: ${errorUpdate.message}`)
                }
            }
        }
    }
</script>

<template>
    <div class="container">
        <div class="card my-2" v-for="(pallet) in pallets" v-show="pallet.status != 'draft'">

            <div class="card-header d-flex justify-content-between">
                <h5>ID: {{ pallet.id }}</h5>
                <h5><deliveryStatusBadge :status="pallet.status"/></h5>
            </div>

            <div class="row">
                <div class="col-12 col-md-9">
                    <ul class="list-group card-body ps-3">
                        <li v-for="(orderInfo) in pallet.orders" class="list-group-item d-flex flex-row justify-content-between">
                            <span>📄{{ orderInfo.barcode }} - 📦{{ orderInfo.package_number }}</span>
                            <span v-if="pallet.status != 'discharged'" @click="handleDeletingOrder(orderInfo.id, pallet.id)" ><font-awesome-icon :icon="['fas', 'trash-can']" style="color: #dc3545;"/></span>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-md-3 d-flex justify-content-center align-items-center">
                    <img :src="pallet.qrCodeImage" alt="QR Code IMG" width="100">
                </div>
            </div>
        </div>
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