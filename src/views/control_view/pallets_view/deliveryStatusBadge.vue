<script setup>
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    const props = defineProps({
        status: {
            type: String,
            required: true
        }
    })


    // Mappa numerica degli stili
    const statusStyles = computed(() => ({
        draft: {
            class: 'bg-danger text-white border badge',
            label: 'Draft'
        },

        closed: {
            class: 'bg-primary text-white border badge',
            label: 'Closed'
        },

        discharged: {
            class: 'bg-success text-dark border badge',
            label: 'Discharged'
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