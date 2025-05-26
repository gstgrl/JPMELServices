<script setup>
    import { useOrders } from '@/services/supabaseFunctions/orders';
    import { ref, onMounted } from 'vue';
    import { useToastStore } from '@/stores/toastStore';
    import deliveryStatusBadge from './deliveryStatusBadge.vue';
    import offcanvaChanges from './offcanvaChanges.vue';

    const toastStore = useToastStore()

    const orders = ref([])
    const orderForOffcanva = ref({})

    onMounted(async() => {
        const {data: ordersData, error: fetchingError} = await useOrders().getOrderWithBinding()
        if(fetchingError)  {
            toastStore.show("Error during fetching orders", 'warning')
            throw new Error(`Error during fetching orders: ${fetchingError.message}`)
        }

        for(let order of ordersData) {
            orders.value.push(order)
        }
    })

    const sendInfoToOffcanva = (order) => {
        orderForOffcanva.value = order
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
        <div class="card my-2" v-for="(order) in orders">
            <div class="card-header d-flex justify-content-between">
                <h5>📄{{ order.barcode }} - 📦{{ order.package_number }}</h5>
                <h5><deliveryStatusBadge :status="order.status"/></h5>
            </div>

            <div class="row card-body justify-content-between">
                <div class="col-4">
                    <h5>{{ $t('orderCreation.sender') }}</h5>
                    <h6>{{ $t('orderCreation.placeholderNameReciver') }}: <span>{{ order.sender.name }}</span></h6>
                    <h6>{{ $t('orderCreation.placeholderSurnameReciver') }}: <span>{{ order.sender.surname }}</span></h6>
                    <h6>Email: <span>{{ order.sender.email }}</span></h6>
                </div>

                <div class="col-4">
                    <h5>{{ $t('orderCreation.receiver') }}</h5>
                    <h6>{{ $t('orderCreation.placeholderNameReciver') }}: <span>{{ order.receiver.name }}</span></h6>
                    <h6>{{ $t('orderCreation.placeholderSurnameReciver') }}: <span>{{ order.receiver.surname }}</span></h6>
                    <h6>Email: <span>{{ order.receiver.email }}</span></h6>
                </div>

                <div class="col-2 d-flex justify-content-end align-items-center">
                    <button class="btn button-custom" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvaChanges" aria-controls="offcanvaChanges" @click="sendInfoToOffcanva(order)" :disabled="order.status == 5">
                        <font-awesome-icon :icon="['fas', 'pen']" />
                    </button>
                </div>
            </div>
        </div>

        <offcanvaChanges :order="orderForOffcanva" @update-status="updateStatus"/>
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