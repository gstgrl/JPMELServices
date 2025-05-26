<script setup>
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    const props = defineProps({
        status: {
            type: Number,
            required: true
        }
    })



    // Mappa numerica degli stili
    const statusStyles = computed(() => ({
        1: {
            class: 'bg-secondary text-white border badge',
            label: t('controlView.orders.badges.processing')
        },

        2: {
            class: 'bg-primary text-white border badge',
            label: t('controlView.orders.badges.shipped')
        },

        3: {
            class: 'bg-warning text-dark border badge',
            label: t('controlView.orders.badges.arrived')
        },

        4: {
            class: 'bg-info text-dark border badge',
            label: t('controlView.orders.badges.inDelivery')
        },

        5: {
            class: 'bg-success text-white border badge',
            label: t('controlView.orders.badges.delivered')
        }
    }));
</script>

<template>
  <span :class="statusStyles[props.status].class">
    {{ statusStyles[props.status].label }}
  </span>
</template>

<style scoped>
    .badge {
        font-size: 0.75rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-left: 0.5rem;
    }
</style>