<script setup>
    import JsBarcode from 'jsbarcode';
    import { onMounted } from 'vue';

    const props = defineProps({
        barcode: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    })

    // Usa onMounted per eseguire JsBarcode una volta che il DOM è pronto
    onMounted(() => {
        JsBarcode(`#${props.id}`, props.barcode, {
            format: "CODE128",
            displayValue: true
        });
    });
</script>


<template>
    <svg :id="props.id" style="max-width: 160px;" class="barcode-img"></svg>
</template>

<style scoped>
    .barcode-img {
        border: 1px solid black; /* Bordo sottile nero */
        border-radius: 1rem;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Ombra del box con opacità */
        margin: 0 0.5rem;

        max-width: 160px;
        height: auto;
    }

</style>
