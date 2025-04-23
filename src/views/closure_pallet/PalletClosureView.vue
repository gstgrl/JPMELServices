<script setup>
    import { ref, watch } from 'vue';
    import { useRouter } from "vue-router";
    import scanner from '@/components/ui/scanner.vue';
    import barcode from '@/components/ui/barcode.vue';

    //Pinia Stores
    import { usePalletStore } from '@/stores/outBoundPalletStore';
    import { useDeviceStore } from '@/stores/diveceStore';
    import { useCameraStore } from '@/stores/cameraStore';

    
    //Pinia stores intialization
    const outBoundPallet = usePalletStore()
    const deviceStore = useDeviceStore()
    const cameraStore = useCameraStore()
    const router = useRouter();
    
    const barcodeValue = ref("")


    const addOrder = async () => {
        const result = outBoundPallet.checkAlreadyIn(barcodeValue.value)

        if(!result) {
            await outBoundPallet.addOrder(barcodeValue.value, 1, null)
            barcodeValue.value = ""
        }else{
            window.alert("Ordine gia presente nel bancale")
        }
    }

    watch(() => cameraStore.scannedCode, async (newCode) => {
        if (newCode) {
            barcodeValue.value = newCode;
            addOrder()
        }
    });

    const closePallet = async() => {
        if(!outBoundPallet.palletId) {outBoundPallet.defineID()}

        await outBoundPallet.closePallet()
        outBoundPallet.generateQrCode()
        outBoundPallet.resetPalletStore()

        router.push("/dashboard")
    }
</script>



<template>
    <div class="container">
      <!-- Input per il Barcode -->
      <div class="input-group my-3">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('palletClosure.placholderInput')"
          v-model="barcodeValue"
          @keyup.enter="addOrder"
        />
        <scanner v-if="deviceStore.isMobile"></scanner>
      </div>
  
      <!-- Lista degli ordini nel bancale -->
      <div v-if="outBoundPallet.orders.length !== 0" class="orders">
        <div v-for="(orderOnPallet, index) in outBoundPallet.orders" :key="index" class="order-item">
          <!-- Visualizzazione del Barcode come SVG -->
          <barcode :barcode="orderOnPallet.barcodeValue" :id="`barcodeTag${index}`" />
  
          <!-- Dettagli ordine con bottone di rimozione -->
          <div class="order-info">
            <h6>{{ orderOnPallet.address }}, </h6>
            <h6>{{ orderOnPallet.city }}, </h6>
            <h6>{{ orderOnPallet.province }}</h6>
          </div>
  
          <!-- Bottone per rimuovere l'ordine dal bancale -->
          <button
            type="button"
            @click="outBoundPallet.removeOrder(orderOnPallet.barcodeValue)"
            class="btn btn-danger delete-button"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
        </div>
      </div>
  
      <!-- Bottone per chiudere il bancale -->
      <button
        type="button"
        class="btn btn-primary mt-3"
        @click="closePallet"
        v-if="outBoundPallet.orders.length !== 0"
      >
        <font-awesome-icon :icon="['fas', 'check-circle']" />
        {{ $t('palletClosure.closureButton') }}
      </button>
    </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    height: 100%;
  }

  /* Stile per l'input del barcode */
  .input-group {
    width: 100%;
    max-width: 600px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .orders {
    width: 100%;
    max-width: 600px;
    margin-top: 20px;
    padding: 15px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }

  /* Stile per ciascun ordine nel bancale */
  .order-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .order-item:last-child {
    border-bottom: none;
  }

  .order-info {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    color: #333;
  }

  /* Stile per il barcode SVG */
  .barcode-img {
    max-width: 120px;
    height: auto;
    border: 1px solid #000;
    border-radius: 5px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    margin-right: 20px;
  }

  /* Stile per il bottone di rimozione ordine */
  .delete-button {
    padding: 8px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .delete-button:hover {
    background-color: #c82333;
  }

  /* Stile per il bottone "Chiudi Bancale" */
  .btn-primary {
    background-color: #007bff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-primary font-awesome-icon {
    margin-right: 8px;
  }
</style>