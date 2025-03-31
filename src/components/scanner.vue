<script setup>
    import { onMounted } from 'vue';
    import { useCameraStore } from '@/stores/cameraStore';
  
    const cameraStore = useCameraStore();
  
    // 🔹 Controlla i permessi quando il componente è caricato
    onMounted(() => {
        cameraStore.checkPermissions();
    });
  
    const toggleScanner = () => {
        if (cameraStore.isCameraActive) {
        cameraStore.stopScanner();
        } else {
        cameraStore.startScanner();
        }
    };
</script>

<template>
<div>
    <button @click="toggleScanner">
        {{ cameraStore.isCameraActive ? 'Spegni Scanner' : 'Accendi Scanner' }}
    </button>

    <p v-if="!cameraStore.permissionGranted" class="error">
        ⚠️ Permessi fotocamera non concessi. Attivali dalle impostazioni del browser.
    </p>

    <div v-if="cameraStore.isCameraActive" id="scanner-container"></div>

        <p v-if="cameraStore.scannedCode">
            📌 Codice Scansionato: <strong>{{ cameraStore.scannedCode }}</strong>
        </p>
    </div>
</template>
  
  
  
<style>
    .error {
        color: red;
        font-weight: bold;
    }
</style>
  