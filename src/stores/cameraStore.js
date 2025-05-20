import { defineStore } from 'pinia'
import { ref, onUnmounted } from 'vue'
import { 
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanType  // Aggiungi questo import
} from 'html5-qrcode';

export const useScannerStore = defineStore('scanner', () => {
  const activateScanner = ref(false)
  const scanner = ref(null)
  const isScanning = ref(false)
  const hasPermission = ref(false)
  const scannedData = ref(null)
  const error = ref(null)
  const cameraId = ref(null)

  const activateScannerFun = async() => {
    activateScanner.value = true
  }

  const initializeScanner = async (videoElementId) => {
    try {
      scanner.value = new Html5Qrcode(videoElementId)
      return true
    } catch (err) {
      error.value = 'Failed to initialize scanner'
      console.error(err)
      return false
    }
  }

  const getCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras()
      if (devices && devices.length > 0) {
        // Cerca la fotocamera posteriore
        const backCamera = devices.find(camera => 
          camera.label.toLowerCase().includes('back') || 
          camera.label.toLowerCase().includes('rear') ||
          camera.label.toLowerCase().includes('ambiente')
        )
        
        // Se non trovata, usa l'ultima fotocamera (spesso è la posteriore)
        cameraId.value = backCamera ? backCamera.id : devices[devices.length - 1].id
        return devices
      }
      throw new Error('No cameras found')
    } catch (err) {
      error.value = 'Cannot access camera devices'
      console.error(err)
      return []
    }
  }

  const startScan = async (videoElementId) => {
    if (!scanner.value) {
      const initialized = await initializeScanner(videoElementId)
      if (!initialized) return false
    }

    try {
      const cameras = await getCameras()
      if (cameras.length === 0) {
        error.value = 'No cameras available'
        return false
      }    

      // Configurazione ottimizzata
      const config = {
        fps: 15,  // Aumenta il frame rate
        qrbox: {
          width: 280,
          height: 280
        },
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.CODE_128
        ]
      }

      // Aggiungi un piccolo delay prima di iniziare la scansione
      await new Promise(resolve => setTimeout(resolve, 300))

      await scanner.value.start(
        cameraId.value,
        config,
        (decodedText, decodedResult) => {
          // Solo se effettivamente decodificato
          if (decodedText) {
            onScanSuccess(decodedText, decodedResult)
          }
        },
        (errorMessage, errorObj) => {
          // Filtra gli errori non rilevanti
          if (!errorMessage.includes('NotFoundException') && 
              !errorMessage.includes('No MultiFormat Readers')) {
            error.value = `Errore: ${errorMessage}`
          }
        }
      )

      isScanning.value = true
      hasPermission.value = true
      return true
    } catch (err) {
      error.value = err.message || 'Failed to start scanning'
      console.error(err)
      return false
    }
  }

  const stopScan = async () => {
    if (scanner.value && isScanning.value) {
      try {
        await scanner.value.stop()
        isScanning.value = false
        return true
      } catch (err) {
        error.value = 'Failed to stop scanner'
        console.error(err)
        return false
      }
    }
    return false
  }

  const onScanSuccess = (decodedText, decodedResult) => {
    scannedData.value = {
      text: decodedText,
      result: decodedResult
    }
    // Auto-stop after successful scan (optional)
    stopScan()
  }

  const onScanError = (errorMessage) => {
    if (!errorMessage.includes('NotFoundException')) {
      error.value = errorMessage
    }
  }

  const resetScanner = () => {
    scannedData.value = null
    error.value = null
  }

  onUnmounted(async () => {
    if (scanner.value && isScanning.value) {
      await stopScan()
    }
  })

  return {
    activateScanner,
    scanner,
    isScanning,
    hasPermission,
    scannedData,
    error,
    cameraId,
    activateScannerFun,
    initializeScanner,
    getCameras,
    startScan,
    stopScan,
    resetScanner
  }
})