<script setup>
    import { ref } from 'vue';
    import { useRouter } from "vue-router";
    import { generateQRCodeAndSave } from '@/services/generateQrcode';
    import scanner from '@/components/scanner.vue';

    //Pinia Stores
    import { usePalletStore } from '@/stores/palletStore';
    import { useOrder } from '@/stores/order';
    import { useAuthStore } from '@/stores/auth';
    import { useDeviceStore } from '@/stores/diveceStore';


    const generatedQRCODE = ref(false)
    
    //Pinia stores
    const palletStore = usePalletStore()
    const order = useOrder()
    const authStore = useAuthStore()
    const deviceStore = useDeviceStore()

    const barcodeTakenByForm = ref("")
    const refreshKey = ref(0)

    const router = useRouter();

    const addOrderInPallet = async() => {

        await order.findOrder(barcodeTakenByForm.value).then((found) => {
            if(found) {
                palletStore.addOrder(order.item)
            }
        }).catch((error) => {
            console.error("Errore durante l'aggiunta dell'ordine:", error);
        });

        barcodeTakenByForm.value = ""
        order.resetOrder()
    }

    const close = async() => {
        await palletStore.closePallet()
        generateQRCodeAndSave(palletStore.barcodes, authStore.user)
        generatedQRCODE.value = true
        palletStore.resetPallet()
        router.push("/dashboard")
    }
</script>





<template>
    <div class="container" v-if="!generatedQRCODE">
        <div class="input-group my-3">
            <input type="text" class="form-control" placeholder="Barcode" aria-label="Barcode" aria-describedby="basic-addon1" v-model="barcodeTakenByForm" @keyup.enter="addOrderInPallet">
            <scanner></scanner>
        </div>

        <p v-if="cameraStore.scannedCode">
            📌 Codice Scansionato: <strong>{{ cameraStore.scannedCode }}</strong>
        </p>

        <div v-if="palletStore.pallet.length != 0" class="orders"  :key="refreshKey">

            <div class="order" v-for="(orderOnPallet, index) in palletStore.pallet">
                <div>
                    {{ orderOnPallet.barcodeValue }} - {{ orderOnPallet.address }}, {{ orderOnPallet.city }}, {{ orderOnPallet.province }}
                </div>
                <button type="button" @click="palletStore.removeOrder(orderOnPallet.barcodeValue)" class="btn btn-danger delete-button"><font-awesome-icon :icon="['fas', 'xmark']"/></button>
            </div>
        </div>

        <button type="button" class="btn btn-primary mt-3" @click="close" v-if="palletStore.pallet.length != 0">CHIUDI BANCALE</button>
    </div>
</template>

<style scoped>
    .container {
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

    .delete-button {
        margin-left: 0.5rem;
        padding: 0.35rem;
    }
</style>