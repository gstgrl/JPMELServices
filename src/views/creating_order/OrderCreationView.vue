<script setup>
    import { ref, nextTick, computed } from "vue";

    import { useOrderStore } from "@/stores/orderStore";
    import { usePalletStore } from "@/stores/outBoundPalletStore";
    import { generateNumericBarcode } from "@/services/generateBarcode";
    import JsBarcode from 'jsbarcode';


    const generatedBarcode = ref(false)
    const barcode = ref("")
    const currentOrder = ref({
        name: "",
        surname: "",
        address: "",
        province: "",
        city: "",
        phoneNumber: ""
    })

    const palletStore = usePalletStore()
    const orderStore = useOrderStore()

    const generateBarcode = async() => {
        barcode.value = generateNumericBarcode(); // Genera e salva il codice
        generatedBarcode.value = true

        await nextTick();

        JsBarcode("#barcode", barcode.value, {
            format: "CODE128",
            displayValue: true,
        });
    }

    const saveOrder = () => {
        palletStore.addOrder(barcode.value, null, currentOrder.value)
        orderStore.addOrder(barcode.value, currentOrder.value)
        //generatePDFLabel(barcode.value, currentOrder.value)
        resetOrder()
        generatedBarcode.value = false
    };

    const isFormValid = computed(() => {
        return Object.values(currentOrder.value).every(value => value !== '');
    });

    const resetOrder = () => {
        Object.keys(currentOrder.value).forEach(key => {
            currentOrder.value[key] = ''; // Imposta ogni valore a stringa vuota
        });
    };
</script>

<template>
    <div class="container mt-5">
        <div class="title-barcode">
            <h2>{{ $t('orderCreation.title') }}</h2>
            <svg v-if="generatedBarcode" id="barcode"></svg>
        </div>

        <form @submit.prevent="saveOrder">
            <div class="mb-3">
                <label class="form-label">{{ $t('orderCreation.receiver') }}</label>
                <div class="name-surname-div">
                    <input
                        type="text"
                        class="form-control m-1"
                        v-model="currentOrder.name"
                        :placeholder="$t('orderCreation.placeholderNameReciver')"
                        required
                    />
                    <input
                        type="text"
                        class="form-control m-1"
                        v-model="currentOrder.surname"
                        :placeholder="$t('orderCreation.placeholderSurnameReciver')"
                        required
                    />
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">{{ $t('orderCreation.address') }}</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="currentOrder.address"
                    required
                />
            </div>

            <div class="mb-3">
                <label class="form-label">{{ $t('orderCreation.province') }}</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="currentOrder.province"
                    required
                />
            </div>

            <div class="mb-3">
                <label class="form-label">{{ $t('orderCreation.city') }}</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="currentOrder.city"
                    required
                />
            </div>

            <div class="mb-3">
                <label class="form-label">{{ $t('orderCreation.phoneNumber') }}</label>
                <input
                    type="phone"
                    class="form-control"
                    v-model="currentOrder.phoneNumber"
                    required
                />
            </div>

            <button type="button" class="btn btn-light" @click="generateBarcode" :disabled="!isFormValid" v-if="!generatedBarcode">{{ $t('orderCreation.buttons.generateBarCode') }}</button>
            <button type="submit" v-if="generatedBarcode" class="btn btn-primary">{{ $t('orderCreation.buttons.saveOrder') }}</button>
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