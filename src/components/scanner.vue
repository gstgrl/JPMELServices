<script setup>
    import { onMounted } from 'vue';
    import { useCameraStore } from '@/stores/cameraStore';
  
    const cameraStore = useCameraStore();
  
    // 🔹 Controlla i permessi quando il componente è caricato
    onMounted(() => {
        cameraStore.checkPermissions();
    });
</script>



<template>

    <span class="input-group-text" id="basic-addon1" v-if="deviceStore.isMobile">
        <button class="btn btn-light border-0"  @click="cameraStore.startScanner()"><font-awesome-icon :icon="['fas', 'camera']" /></button>
    </span>

    <div>

        <p v-if="!cameraStore.permissionGranted" class="error">
            ⚠️ Permessi fotocamera non concessi. Attivali dalle impostazioni del browser.
        </p>

        <div v-if="cameraStore.isCameraActive" id="scanner-container"></div>


    </div>
</template>
  
  
  
<style>
    .error {
        color: red;
        font-weight: bold;
    }
</style>
  