<script setup>
    import { ref } from 'vue';
    import deliveryStatusBadge from './deliveryStatusBadge.vue';


    const props = defineProps({
        order: {
            type: Object,
            required: true
        }
    })

    const emit = defineEmits(['update-status', 'order-deleted'])

    const optionSelected = ref('')

    const updateOrder = () => {
        emit('update-status', {
            id: props.order.id,
            status: optionSelected.value
        })

    }

    const deleteOrder = () => {
        emit('order-deleted', {
            value: true,
            id: props.order.id
        })
    }
</script>


<template>
    <div class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="offcanvaChanges" aria-labelledby="offcanvaChangesLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvaChangesLabel">{{ $t('controlView.orders.actions.modifyOrder') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>


        <div class="offcanvas-body d-flex flex-column">
            <form @submit.prevent="updateOrder">
                <select class="form-select" aria-label="Default select example" v-model="optionSelected">
                    <option value="" selected disabled>{{ $t('controlView.orders.orderStatus') }}</option>
                    <option :value="1">{{ $t('controlView.orders.badges.processing') }}</option>
                    <option :value="2">{{ $t('controlView.orders.badges.shipped') }}</option>
                    <option :value="3">{{ $t('controlView.orders.badges.arrived') }}</option>
                    <option :value="5">{{ $t('controlView.orders.badges.delivered') }}</option>
                </select>

                <button class="btn btn-primary mx-auto mt-4" data-bs-dismiss="offcanvas" aria-label="Close" type="submit" v-if="optionSelected">Salva</button>
            </form>

            <button class="btn btn-danger mt-auto" @click="deleteOrder" data-bs-dismiss="offcanvas" aria-label="Close" type="submit">Elimina ordine</button>
        </div>
    </div>
</template>