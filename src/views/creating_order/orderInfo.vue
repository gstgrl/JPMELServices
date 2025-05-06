<script setup>
    import { nextTick, ref } from 'vue';
    import JsBarcode from 'jsbarcode';
    import { generateNumericBarcode } from '@/services/generateBarcode';

    import { usePalletStore } from '@/stores/palletStore';
    import { useOrderStore } from '@/stores/orderStore';
    import { useOrders } from '@/services/supabaseFunctions/orders';
    import { usePallets } from '@/services/supabaseFunctions/pallets';

    const generatedBarcode = ref(false)
    const barcode = ref('')

    const orderStore = useOrderStore()
    const palletStore = usePalletStore()

    const generateBarcode = async() => {
        barcode.value = generateNumericBarcode()
        orderStore.addNewInfo(null, null, barcode.value)
        generatedBarcode.value = true

        await nextTick()

        JsBarcode("#barcode", barcode.value, {
            format: "CODE128",
            displayValue: true
        });
    }

    const saveOrder = async() => {

        const orderToSend = {
            barcode: orderStore.currentOrder.barcode,
            sender_id: orderStore.currentOrder.sender_id,
            receiver_id: orderStore.currentOrder.receiver_id,
            package_number: orderStore.currentOrder.package_number
        }

        const { data: orderData, error: orderError } = await useOrders().createOrder(orderToSend)

        if (orderError || !orderData?.length) {
            console.error('Errore durante la creazione dell’ordine:', orderError)
            return
        }

        orderStore.triggerAction = true
        barcode.value = ''
        generatedBarcode.value = false
        orderStore.resetOrder()  
    }


</script>

<template>
    <form @submit.prevent="generateBarcode">
        <div class="title-barcode">
            <svg v-if="generatedBarcode" id="barcode"></svg>
        </div>

        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Colli</span>
            <input type="number" class="form-control" aria-label="Package Number" aria-describedby="basic-addon1" min="1" value="1" v-model="orderStore.currentOrder.package_number">
        </div>

        <button type="submit" class="btn btn-primary" v-if="!generatedBarcode">Genera Codice a Barre</button>
    </form>

    <button type="button" class="btn btn-primary" v-if="generatedBarcode" @click="saveOrder">Salva ordine</button>
</template>