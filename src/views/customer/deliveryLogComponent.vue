<script setup>
    const props = defineProps({
        log: {
            type: Object,
            required: true
        }
    })

    function formatDate(date) {
        return new Date(date).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }



</script>


<template>
    <div class="d-flex align-items-start">
        <div class="timeline-icon bg-primary rounded-circle me-3" style="width: 16px; height: 16px;"></div>
        <div>
            <small class="text-muted">{{ formatDate(props.log.created_at) }}</small>
            <h6 class="mb-1">{{ props.log.status }}</h6>
            <p class="mb-0 text-secondary" v-if="log.location">📍 {{ log.location }}</p>
        </div>
    </div>
</template>

<style scoped>
    .timeline-icon {
        position: absolute;
        left: -9px;
        top: 2px;
    }
</style>