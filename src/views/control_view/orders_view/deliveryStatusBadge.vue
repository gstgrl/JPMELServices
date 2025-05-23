<script setup>
    import { computed, ref } from 'vue';

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
            label: 'Processing'
        },

        2: {
            class: 'bg-primary text-white border badge',
            label: 'Shipped'
        },

        3: {
            class: 'bg-warning text-dark border badge',
            label: 'Arrived in Domenican'
        },

        4: {
            class: 'bg-info text-dark border badge',
            label: 'In delivery'
        },

        5: {
            class: 'bg-success text-white border badge',
            label: 'Delivered'
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