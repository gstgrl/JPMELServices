import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Html5QrcodeScanner } from "html5-qrcode";

export const useCameraStore = defineStore('camera', () => {
  const isCameraActive = ref(false);
  const scannedCode = ref(null);
  const permissionGranted = ref(false);
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
    await checkPermissions();
    if (!permissionGranted.value) {
      alert("Permessi fotocamera negati. Attiva l'accesso dalle impostazioni del browser.");
      return;
    }

    isCameraActive.value = true;
    scanner = new Html5QrcodeScanner("scanner-container", { fps: 10, qrbox: 250 });

    scanner.render(
      async (decodedText) => {
        scannedCode.value = decodedText;
        stopScanner(); // Ferma lo scanner dopo la scansione
      },
      (errorMessage) => {
        console.warn("Errore scansione:", errorMessage);
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
