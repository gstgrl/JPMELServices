<script setup>
    import { ref, onMounted, onUnmounted, watch } from 'vue'
    import { Modal } from 'bootstrap'
    import { useScannerStore } from '@/stores/cameraStore'

    const props = defineProps({
        videoElementId: {
            type: String,
            default: 'scanner-video'
        }
    })

    const emit = defineEmits(['scan-complete'])

    const modalRef = ref(null)
    let modalInstance = null

    const scannerStore = useScannerStore()

    const handleNewScan = async () => {
        scannerStore.resetScanner()
        await scannerStore.startScan(props.videoElementId)
    }

    const handleRetry = async () => {
        scannerStore.resetScanner()
        await scannerStore.startScan(props.videoElementId)
    }

    // Carica le fotocamere al montaggio
    onMounted(async () => {
        if(modalRef.value) {
            modalInstance = new Modal(modalRef.value)
        }
    })
    

    const open = async() => {
        modalInstance?.show()
        await scannerStore.activateScannerFun()
        await scannerStore.startScan(props.videoElementId)
    }

    const close = async() => {
        await scannerStore.stopScan()
        modalInstance?.hide()
    }

    watch(
        () => scannerStore.scannedData, close,
        {deep: true}
    )

    defineExpose({ open })
</script>

<template>
    <div class="modal fade" id="modalScanner" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalScannerLabel" aria-hidden="true" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalScanner">Scansiona un codice</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
                </div>

                <div class="modal-body">
                    <div class="scanner-container" v-if="scannerStore.activateScanner">
                        <div :id="videoElementId" class="scanner-video-container"></div>
                        
                        <div v-if="scannerStore.isScanning" class="scanner-overlay">
                            <p class="scanner-hint">Inquadra il codice a barre o QR code</p>
                        </div>
                        
                        <div v-if="scannerStore.scannedData" class="scanner-result">
                            <p>Codice scansionato: {{ scannerStore.scannedData.text }}</p>
                            <button @click="handleNewScan" class="btn btn-secondary">Scansiona nuovo codice</button>
                        </div>
                        
                        <div v-if="scannerStore.error" class="scanner-error">
                            {{ scannerStore.error }}
                            <button @click="handleRetry" class="btn btn-secondary">Riprova</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .scanner-container {
        position: relative;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .scanner-video-container {
        width: 100%;
        height: 400px;
        background: #000;
        border-radius: 8px;
        overflow: hidden;
    }

    .scanner-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    .scanner-frame {
        width: 70%;
        height: 200px;
        border: 4px solid rgba(0, 255, 0, 0.5);
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        margin-bottom: 20px;
    }

    .scanner-hint {
        color: white;
        text-shadow: 0 0 5px black;
        font-size: 1.2rem;
    }

    .scanner-result,
    .scanner-error {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin: 0 20px;
        text-align: center;
    }

    .scanner-error {
        background: rgba(255, 0, 0, 0.7);
        top: 20px;
        bottom: auto;
    }
</style>
  