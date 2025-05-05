<script setup>
    import { useClients } from '@/services/supabaseFunctions/clients';
    import { onMounted, ref } from 'vue';

    const props = defineProps({
        show: {
            type: Boolean,
            required: true
        },
        senderID: {
            type: String,
            required: true
        },
        receiverID: {
            type: String,
            required: true
        }
    })

    const sender = ref({})
    const receiver = ref({})


    onMounted(() => {
        sender.value = useClients().getClient(props.senderID)
        receiver.value = useClients().getClient(props.receiverID)
    })

    defineEmits(['close'])
</script>

<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 class="text-xl font-bold mb-4">Informazioni Ordine</h2>

        <div class="mb-3">
            <h3 class="font-semibold">Mittente:</h3>
            <p>Nome: {{ sender.name }}</p>
            <p>Indirizzo: {{ sender.address }}</p>
        </div>

        <div>
            <h3 class="font-semibold">Destinatario:</h3>
            <p>Nome: {{ receiver.name }}</p>
            <p>Indirizzo: {{ receiver.address }}</p>
        </div>

        <button @click="$emit('close')" class="mt-5 bg-blue-600 text-white px-4 py-2 rounded">Chiudi</button>
        </div>
    </div>
</template>
  
  