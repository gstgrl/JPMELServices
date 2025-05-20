<script setup>
    import { ref } from 'vue';
    import deliveryStatusBadge from './deliveryStatusBadge.vue';


    const props = defineProps({
        order: {
            type: Object,
            required: true
        }
    })

    const emit = defineEmits(['update-status'])

    const optionSelected = ref('')

    const updateOrder = () => {
        emit('update-status', {
            status: optionSelected.value,
            id: props.order.id
        })

    }
</script>


<template>
    <div class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="offcanvaChanges" aria-labelledby="offcanvaChangesLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvaChangesLabel">Modifica l'ordine</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>


        <div class="offcanvas-body">
            <form @submit.prevent="updateOrder">
                <select class="form-select" aria-label="Default select example" v-model="optionSelected">
                    <option value="" selected disabled>Stato dell'ordine</option>
                    <option :value="1">Processing</option>
                    <option :value="2">Shipped</option>
                    <option :value="3">Arrived in Domenican</option>
                    <option :value="5">Delivered</option>
                </select>

                <button class="btn btn-primary mx-auto mt-4" data-bs-dismiss="offcanvas" aria-label="Close" type="submit" v-if="optionSelected">Salva</button>
            </form>
        </div>
    </div>
</template>