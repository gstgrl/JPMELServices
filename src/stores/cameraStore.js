import { defineStore } from 'pinia';
import { usePalletStore } from './palletStore';
import { ref } from 'vue';
import { Html5QrcodeScanner } from "html5-qrcode";

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
    if (!permissionGranted.value) {
      await checkPermissions()
      return;
    }

    isCameraActive.value = true;
    scanner = new Html5QrcodeScanner("scanner-container");

    scanner.start(
      { facingMode: "environment" }, // Usa la fotocamera posteriore
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        scannedCode.value = decodedText; // Salva il codice nel Pinia
        stopScanner(); // Ferma lo scanner dopo una scansione
      },
      (errorMessage) => {
        console.log(errorMessage); // Puoi gestire errori qui
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
