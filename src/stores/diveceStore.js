import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

export const useDeviceStore = defineStore('device', () => {
  const isMobile = ref(window.innerWidth <= 768);

  // Funzione per aggiornare lo stato in base alla larghezza della finestra
  const updateDeviceType = () => {
    isMobile.value = window.innerWidth <= 768;
  };

  // Aggiunge un listener per il resize quando lo store viene inizializzato
  onMounted(() => {
    window.addEventListener('resize', updateDeviceType);
  });

  // Rimuove il listener quando lo store viene distrutto
  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceType);
  });

  return { isMobile };
});
