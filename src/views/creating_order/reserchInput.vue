<script setup>
    import { ref, watch } from 'vue'
    import { useClients } from '@/services/supabaseFunctions/clients'  // Importa la funzione useClients
    import { useOrderStore } from '@/stores/orderStore'

    // Inizializza la funzione useClients
    const { getClientsByName } = useClients()
    const orderStore = useOrderStore()

    const props = defineProps({
        inputType: {
            type: String,
            required: true
        },
        inputTitle: {
            type: String,
            required: true
        }
    })

    const search = ref('')  // Il valore del campo di ricerca
    const results = ref([])  // I risultati della ricerca
    const selectedClient = ref(null)
    const showResults = ref(false)
  
    // La funzione di ricerca dei clienti
    const searchClient = async () => {
        if (search.value.length < 3) {
            results.value = []  // Resetta i risultati se la query è troppo corta
            return
        }

        const { data, error: err } = await getClientsByName(search.value)

        if (err) {
            results.value = []
            //console.error('Errore nella ricerca:', err)
        } else {
            results.value = data || []  // Popola i risultati con i clienti trovati
        }
    }

    const selectClient = (client) => {
        selectedClient.value = client
        search.value = client.name
        showResults.value = false
        orderStore.addNewInfo(client, props.inputType, null)
    }

    const deselectClient = () => {
        selectedClient.value = null
        search.value = ''
        results.value = []
        showResults.value = false
        orderStore.deleteInfo(props.inputType)
    }

    watch(() => orderStore.triggerAction, (newVal) => {
        if(newVal) {
            deselectClient()
        }
    })
</script>

<template>
    <div class="position-relative w-100">

        <div class="form-floating">
            <input
                :id="`input-${inputType}`"
                type="text"
                v-model="search"
                class="form-control"
                @input="searchClient"
                @focus="showResults = true"
                placeholder="Cerca cliente per nome"
                aria-label="Name" 
                aria-describedby="button-addon2"
            />
            <label :for="`input-${inputType}`">{{ props.inputTitle }}</label>
        </div>

  
        <ul v-if="showResults && results.length" class="list-group position-absolute w-100 z-index">
            <li
                class="list-group-item list-group-item-action"
                v-for="client in results"
                :key="client.id"
                @click="selectClient(client)"
                >
                {{ client.name }} {{ client.surname }} - {{ client.email }}
            </li>
        </ul>

        <div v-if="selectedClient" class="mt-2 alert alert-success d-flex justify-content-between align-items-center">
            <span>{{ selectedClient.name }}</span>
            <button class="btn btn-sm btn-close" @click="deselectClient"></button>
        </div>
    </div>
</template>

<style scoped>
    .z-index {
        z-index: 1050;
    }
</style>  