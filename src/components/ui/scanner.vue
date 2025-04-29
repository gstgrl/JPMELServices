<script setup>
    import { useCameraStore } from '@/stores/cameraStore';
  
    const cameraStore = useCameraStore();
</script>

<template>
    <span class="input-group-text" id="basic-addon1">
        <button class="btn btn-light border-0"  @click="cameraStore.startScanner"><font-awesome-icon :icon="['fas', 'camera']" /></button>
    </span>
</template>
  