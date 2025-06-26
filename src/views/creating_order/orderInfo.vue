<script setup>
    import JsBarcode from 'jsbarcode';
    import { nextTick, ref } from 'vue';
    import { generateNumericBarcode } from '@/services/generateCodes';
    import { generaEtichettePDF } from '@/services/generateLabel';
    import { generaEtichettaA4PDF } from '@/services/generatePDF';

    import { useOrderStore } from '@/stores/orderStore';
    import { useOrders } from '@/services/supabaseFunctions/orders';
    import { useStatusLog } from '@/services/supabaseFunctions/statusLog';
    import { useToastStore } from '@/stores/toastStore';

    const generatedBarcode = ref(false)
    const barcode = ref('')

    const orderStore = useOrderStore()
    const toastStore = useToastStore()

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
            package_number: orderStore.currentOrder.package_number,
            status: 1
        }

        const { data: orderData, error: orderError } = await useOrders().createOrder(orderToSend)
        if(orderError) {
            toastStore.show("Error during order creation", 'danger')
            throw new Error(`Error during order creation: ${orderError.message}`)
        }

        //Creo un nuovo log di stato avanzamento consegna
        const {data: log, error: errorLog} = await useStatusLog().createLog({order_id: orderData.id, barcode: orderData.barcode, status: 'We are processing your order!'})
        if(errorLog)  {
            toastStore.show("Error during creating order delivery status history log", 'danger')
            throw new Error(`Error during creating order delivery status history log: ${errorLog.message}`)
        }

        await generaEtichettePDF(orderStore.currentOrder.barcode, `${orderStore.currentOrder.sender.name} ${orderStore.currentOrder.sender.surname}`, `${orderStore.currentOrder.receiver.name} ${orderStore.currentOrder.receiver.surname}`, orderStore.currentOrder.receiver.addressInfo.address, orderStore.currentOrder.receiver.addressInfo.province, orderStore.currentOrder.receiver.addressInfo.city, orderStore.currentOrder.receiver.phone, orderStore.currentOrder.package_number)
        await generaEtichettaA4PDF(orderStore.currentOrder.barcode,`${orderStore.currentOrder.sender.name} ${orderStore.currentOrder.sender.surname}`, `${orderStore.currentOrder.receiver.name} ${orderStore.currentOrder.receiver.surname}`, orderStore.currentOrder.receiver.addressInfo.address, orderStore.currentOrder.receiver.addressInfo.province, orderStore.currentOrder.receiver.addressInfo.city, orderStore.currentOrder.receiver.phone, orderStore.currentOrder.package_number)

        orderStore.triggerAction = true
        barcode.value = ''
        generatedBarcode.value = false

        await nextTick()
        
        orderStore.resetOrder()  
        orderStore.resetTrigger()
        toastStore.show("Ordine creato", 'success')// Chiama l'Edge Function per inviare l'email
    }


</script>

<template>
    <form @submit.prevent="generateBarcode">
        <div class="title-barcode">
            <svg v-if="generatedBarcode" id="barcode"></svg>
        </div>

        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">{{ $t('orderCreation.packageNumber') }}</span>
            <input type="number" class="form-control" aria-label="Package Number" aria-describedby="basic-addon1" min="1" value="1" v-model="orderStore.currentOrder.package_number">
        </div>

        <button type="submit" class="btn btn-primary" v-if="!generatedBarcode">{{ $t('orderCreation.buttons.generateBarCode') }}</button>
    </form>

    <button type="button" class="btn btn-primary" v-if="generatedBarcode" @click="saveOrder">{{ $t('orderCreation.buttons.saveOrder') }}</button>
</template>