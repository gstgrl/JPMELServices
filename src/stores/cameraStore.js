import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCameraStore = defineStore('camera', () => {
  const isCameraActive = ref(false);
  const scannedCode = ref(null);
  const permissionGranted = ref(false);
  //const beepSound = new Audio('/suoni/beep.mp3');
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

    scanner = new Html5Qrcode("scanner-container", {
      fps: 10, qrbox: 250
    });

    scanner.render((decodedText) => {
      scannedCode.value = decodedText; // Salva il codice scansionato
      stopCamera(); // Ferma la scansione dopo una lettura
    })
    
    isCameraActive.value = true;
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
