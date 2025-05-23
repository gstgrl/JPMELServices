<script setup>
    import { ref } from 'vue';
    import { useStatusLog } from '@/services/supabaseFunctions/statusLog'; 
    import { useToastStore } from '@/stores/toastStore';
    import deliveryLogComponent from './deliveryLogComponent.vue';

    const toast = useToastStore()
    const orderIdByInput = ref('')
    const logs = ref([])

    const fetchLogs = async() => {
        if(!orderIdByInput.value) {
            toast.show("Inserire un ID", 'warning')
            orderIdByInput.value = ''
            return
        }

        if(logs.value) {
            logs.value = []
        }
        
        const {data: fetchedLogs, error: errorLogs} = await useStatusLog().getLogs(null, orderIdByInput.value)
        if(errorLogs) throw new Error(`Error during fetching logs: ${errorLogs.message}`)

        orderIdByInput.value = ''

        for(let log of fetchedLogs) {
            logs.value.push(log)
        }
    }

</script>

<template>
    <div class="container my-4">
        <div class="row">
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="orderIdInput" placeholder="Order ID" @keyup.enter="fetchLogs" v-model="orderIdByInput">
                <label for="orderIdInput">Order ID</label>
            </div>
        </div>

        <div>
            <ul class="timeline list-unstyled">
                <li v-for="(item, index) in logs" :key="index" class="timeline-item mb-4">
                    <div class="d-flex align-items-start">
                        <deliveryLogComponent :log="item"/>
                    </div>
                </li>
            </ul>
        </div>
    </div>

</template>

<style scoped>
    .timeline-item {
        position: relative;
        padding-left: 30px;
        border-left: 2px solid #dee2e6;
    }
</style>