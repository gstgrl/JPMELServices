import { defineStore } from 'pinia';
import { usePalletStore } from './palletStore';
import { ref } from 'vue';

export const useCameraStore = defineStore('camera', () => {
  const isCameraActive = ref(false);
  const scannedCode = ref(null);
  const permissionGranted = ref(false);

  const palletStore = usePalletStore()
  let scanner = null;

  // 🔹 Controllo permessi fotocamera
  const checkPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      permissionGranted.value = true;
    } catch (error) {
      console.error("Accesso alla fotocamera negato:", error);
      permissionGranted.value = false;
    }
  };

  // 🔹 Avvia lo scanner solo se i permessi sono concessi
  const startScanner = async () => {
    const { Html5Qrcode } = await import("html5-qrcode");

    if (!permissionGranted.value) {
      await checkPermissions()
      return;
    }

    isCameraActive.value = true;
    scanner = new Html5Qrcode("scanner-container");

    scanner.start(
      { facingMode: "environment" }, 
      { fps: 10, qrbox: 250 }, 
      (decodedText) => {
        scannedCode.value = decodedText
        stopScanner(); // Ferma dopo la prima scansione
      },
      (errorMessage) => {
        console.warn("Errore scanner:", errorMessage);
      }  
    );
  };

  // 🔹 Ferma lo scanner
  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      scanner = null;
      isCameraActive.value = false;
    }
  };

  return { 
    isCameraActive, 
    scannedCode, 
    permissionGranted,
    startScanner, 
    stopScanner, 
    checkPermissions 
  };
});
