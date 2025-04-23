<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { useRouter } from "vue-router";

    //Vue components
    import scanner from '@/components/scanner.vue';
    import warehouseComponent from '@/components/warehouseComponent.vue';

    //Pinia Stores
    import { useWareHouseStore } from '@/stores/warehouseStore';
    import { useDeviceStore } from '@/stores/diveceStore';
    import { useCameraStore } from '@/stores/cameraStore';
    import { useDeliveryPool } from '@/stores/deliveryPoolStore';

    
    //Pinia stores intialization
    const warehouseStore = useWareHouseStore()
    const deviceStore = useDeviceStore()
    const cameraStore = useCameraStore()
    const deliveryPoolStore = useDeliveryPool()
    const router = useRouter();
    
    const palletIdValue = ref("")

    watch(() => cameraStore.scannedCode, async (newCode) => {
        if (newCode) {
            barcodeValue.value = newCode;
            addOrder()
        }
    });

    onMounted(async() => {
        if(!warehouseStore.alreadyCharged) {
            await warehouseStore.feetchPalletDischarged()
        }
    })

    const startDeliverying = async() => {
        let userResponse = window.confirm("Vuoi continuare")

        if(userResponse) {
            router.push('/delivery')
            await deliveryPoolStore.startDelivery()
        }
    }
</script>

<template>
    <div class="warehouse-container container">
        <div class="input-group my-3">
            <input type="text" class="form-control" placeholder="Pallet ID" aria-label="PalletId" aria-describedby="basic-addon1" v-model="palletIdValue" @keyup.enter="warehouseStore.dischargPalletById(palletIdValue)">
            <scanner v-if="deviceStore.isMobile"></scanner>
        </div>

        <div id="scanner-container"></div>

        <div v-if="deliveryPoolStore.orderNumber > 0">
            <p>{{ $t('warehouse.selectedOrder') }}: {{ deliveryPoolStore.orderNumber }}</p>
            <button type="button" class="btn btn-success" @click="startDeliverying">{{ $t('warehouse.buttons.deliveryButton') }}</button>
        </div>

        <div v-if="warehouseStore.warehouseOrders.length != 0" class="warehouse-view container">
            <div v-for="(item, index) in warehouseStore.warehouseOrders">
                <warehouseComponent :item="item" :id="`warehouseComponent-${index}`"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .warehouse-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .input-group {
        width: 50%;
        height: 50%;
        display: flex;
        flex-direction: row;
    }

    .orders {
        border: 1.5px solid rgb(184, 184, 184); /* Bordo nero di 2px */
        padding: 10px; /* Spazio interno */
        border-radius: 5px; /* Angoli arrotondati */
        margin-top: 10px; /* Distanza dagli altri elementi */
        background-color: #f8f9fa; /* Colore di sfondo leggero */
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Effetto ombra */
    }

    .order {
        padding: 0.3rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .info-deleting-button-div {
        display: flex;
        flex-direction: column;
    }

    .order-info-div {
        display: flex;
        flex-direction: row;
    }

    .delete-button {
        margin-left: 0.5rem;
        padding: 0.35rem;
    }

    .warehouse-view {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Aumentato il valore minimo a 250px */
        gap: 20px; /* Spazio tra gli elementi */
        justify-items: stretch; /* Stretch per fare in modo che gli elementi occupino tutta la larghezza disponibile */
        padding: 10px;
    }
</style>