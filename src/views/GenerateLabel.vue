<script setup>
    import { ref, nextTick, computed } from "vue";
    import { generateAndSaveBarcode } from "@/services/barcodeService";
    import { generateLabelPDF } from "@/services/generatePDF"
    import { usePalletStore } from "@/stores/palletStore";
    import { useOrder } from "@/stores/order";

    const generatedBarcode = ref(false)
    const palletStore = usePalletStore()
    const order = useOrder()

    const saveOrder = () => {
        palletStore.addOrder(order.item)
        order.saveOrderOnDB()
        generateLabelPDF()

        generatedBarcode.value = false
        order.resetOrder()
    };

    const generateBarcode = async() => {
        order.item.barcodeValue = await generateAndSaveBarcode(); // Genera e salva il codice
        generatedBarcode.value = true

        await nextTick();

        JsBarcode("#barcode", order.item.barcodeValue, {
            format: "CODE128",
            displayValue: true,
        });
    }

    const isFormValid = computed(() => {
        return order.isOrderValid(); // Verifica che tutti i campi siano validi
    });
</script>

<template>
    <div class="container mt-5">
        <div class="title-barcode">
            <h2>Genera etichetta</h2>
            <svg v-if="generatedBarcode" id="barcode"></svg>
        </div>

        <form @submit.prevent="saveOrder">
            <div class="mb-3">
                <label class="form-label">Destinatario</label>
                <div class="name-surname-div">
                    <input
                        type="text"
                        class="form-control m-1"
                        v-model="order.item.name"
                        placeholder="Nome"
                        required
                    />
                    <input
                        type="text"
                        class="form-control m-1"
                        v-model="order.item.surname"
                        placeholder="Cognome"
                        required
                    />
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Indirizzo</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="order.item.address"
                    required
                />
            </div>

            <div class="mb-3">
                <label class="form-label">Provincia</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="order.item.province"
                    required
                />
            </div>

            <div class="mb-3">
                <label class="form-label">Città</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="order.item.city"
                    required
                />
            </div>

            <div class="mb-3">
                <label class="form-label">Cellulare</label>
                <input
                    type="phone"
                    class="form-control"
                    v-model="order.item.phoneNumber"
                    required
                />
            </div>

            <button type="button" class="btn btn-light" @click="generateBarcode" :disabled="!isFormValid" v-if="!generatedBarcode">Genera Codice a Barre</button>
            <button type="submit" v-if="generatedBarcode" class="btn btn-primary">Salva Ordine</button>
        </form>
    </div>
</template>


<style scoped>
    .title-barcode {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
    }

    .name-surname-div {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
</style>