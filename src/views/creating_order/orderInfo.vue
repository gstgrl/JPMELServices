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

        const orderID = orderData[0].id

        if(orderStore.currentOrder.addToPallet) {
            
            palletStore.orders.push(orderStore.currentOrder)
            palletStore.barcodes.push(orderStore.currentOrder.barcode)
            let palletID = palletStore.palletId

            //Se non è presente alcun bancale lo creo ed associo quel palletID nel Pinia Store
            if(!palletID) {
                const { data: palletData, error: palletError } = await usePallets().createPallet({status: "Loading"})

                if (palletError || !palletData?.length) {
                    console.error('Errore durante la creazione del pallet:', palletError)
                    return
                }

                palletID = palletData[0].id
                palletStore.palletId = palletID //Associo il nuovo palletID al Pinia cosi da caricare i futuri ordini nel bancale
            }

            //Fa l'aggiornamento dell'ordine aggiungendo il palletID corrispondente
            const { error: updateError } = await useOrders().updateOrder(orderID, {
                pallet_id: palletID
            })

            if (updateError) {
                console.error('Errore nell’associare pallet all’ordine:', updateError)
                return
            }

        }

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

        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="orderStore.currentOrder.addToPallet">
            <label class="form-check-label" for="exampleCheck1">Aggiungere al bancale</label>
        </div>

        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Colli</span>
            <input type="number" class="form-control" aria-label="Package Number" aria-describedby="basic-addon1" min="1" value="1" v-model="orderStore.currentOrder.package_number">
        </div>

        <button type="submit" class="btn btn-primary" v-if="!generatedBarcode">Genera Codice a Barre</button>
    </form>

    <button type="button" class="btn btn-primary" v-if="generatedBarcode" @click="saveOrder">Salva ordine</button>
</template>