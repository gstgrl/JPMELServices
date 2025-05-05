<script setup>
    import { ref, watch } from 'vue';
    import { useRouter } from "vue-router";
    import scanner from '@/components/ui/scanner.vue';
    import barcode from '@/components/ui/barcode.vue';
    import modalOrderInfo from './modalOrderInfo.vue';

    //Pinia Stores
    import { usePalletStore } from '@/stores/palletStore';
    import { useDeviceStore } from '@/stores/diveceStore';
    import { useCameraStore } from '@/stores/cameraStore';

    
    //Pinia stores intialization
    const palletStore = usePalletStore()
    const deviceStore = useDeviceStore()
    const cameraStore = useCameraStore()
    const router = useRouter();
    
    const barcodeValue = ref("")
    const modalVisible = ref(false)
    const sender_ID = ref(null)
    const receiver_ID = ref(null)


    const addOrder = async () => {
        const result = palletStore.checkAlreadyIn(barcodeValue.value)

        if(!result) {
            await palletStore.addOrder(barcodeValue.value)
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
        if(!palletStore.palletId) {palletStore.defineID()}

        await palletStore.closePallet()
        palletStore.generateQrCode()
        palletStore.resetPalletStore()

        router.push("/dashboard")
    }

    const openModal = (order) => {
      senderID.value = order.sender_id
      receiverID.value = order.receiver_id
      modalVisible.value = true
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
      <div v-if="palletStore.orders.length !== 0" class="orders">
        <div v-for="(orderOnPallet, index) in palletStore.orders" :key="index" class="order-item">
          <!-- Visualizzazione del Barcode come SVG -->
          <barcode :barcode="orderOnPallet.barcode" :id="`barcodeTag${index}`" />
  
          <!-- Dettagli ordine con bottone di rimozione -->
          <button class="btn btn-success" @click="openModal(orderOnPallet)">INFO</button>
  
          <!-- Bottone per rimuovere l'ordine dal bancale -->
          <button
            type="button"
            @click="palletStore.removeOrder(orderOnPallet.barcode)"
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
        v-if="palletStore.orders.length !== 0"
        >
        <font-awesome-icon :icon="['fas', 'check-circle']" />
        {{ $t('palletClosure.closureButton') }}
      </button>

      <modalOrderInfo :show="modalVisible" :senderID="sender_ID" :receiveID="receiver_ID"></modalOrderInfo>
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