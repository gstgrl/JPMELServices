<script setup>
    import { ref, onMounted } from 'vue';
    import { Loader } from '@googlemaps/js-api-loader';
    import { useOrderStore } from '@/stores/orderStore';

    const orderStore = useOrderStore()

    const autocompleteInput = ref(null);
    const suggestions = ref([]);

    onMounted(async () => {
        const loader = new Loader({
            apiKey: 'AIzaSyAqrW6PeiJquoPrenOdCCcibwjDP07f0O0',
            libraries: ['places'],
            language: 'it',
            region: 'DO',
        });

        await loader.importLibrary('places');

        const autocompleteService = new google.maps.places.AutocompleteService();

        autocompleteInput.value.addEventListener('input', async () => {
            const input = autocompleteInput.value.value;

            if (input.length > 3) {
                const response = await autocompleteService.getPlacePredictions(
                    { input },
                    (predictions, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                            suggestions.value = predictions;
                        } else {
                            suggestions.value = [];
                        }
                    }
                );
            } else {
                suggestions.value = [];
            }
        });
    });

    const selectAddress = (address) => {
        const adressDescription = address

        console.log(adressDescription)
    }
</script>

<template>
    <div class="container">
          <div class="position-relative w-100">
            <input
                ref="autocompleteInput"
                type="text"
                placeholder="Inserisci un indirizzo"
            />
            <ul v-if="suggestions.length" class="list-group position-absolute w-100">
                <li v-for="(suggestion, index) in suggestions" :key="index" class="list-group-item list-group-item-action" @click="selectAddress(suggestion)">
                    {{ suggestion.description }}
                </li>
            </ul>
        </div>
    </div>
</template>