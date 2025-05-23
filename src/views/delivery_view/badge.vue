<script setup>
    import { computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    
    const props = defineProps({
        orderStatus: {
            type: String,
            required: true
        }
    });

    const statusMap = computed(() => ({
        delivered: { label: t('delivery.badgeStates.delivered'), class: 'bg-success text-white badge' },
        pending: { label: t('delivery.badgeStates.pending'), class: 'bg-secondary text-white badge' },
        rescheduled: { label: t('delivery.badgeStates.rescheduled'), class: 'bg-warning text-dark badge' },
        canceled: { label: t('delivery.badgeStates.canceled'), class: 'bg-danger text-white badge' },
    }))

</script>

<template>
    <span :class="statusMap[props.orderStatus].class">{{ statusMap[props.orderStatus].label }}</span>
</template>

<style scoped>
    .badge {
        font-size: 0.75rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-left: 0.5rem;
    }
</style>