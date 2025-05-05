<script setup>
  import './style.css'
  import { ref, watch, nextTick } from 'vue';
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
  const modal = ref(null)
  const sender_ID = ref('')
  const receiver_ID = ref('')


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

  const openModal = async (order) => {
    sender_ID.value = order.sender_id
    receiver_ID.value = order.receiver_id

    await nextTick()

    modal.value.open()
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
        <div v-for="(order, index) in palletStore.orders" :key="index" class="order-item">
          <!-- Visualizzazione del Barcode come SVG -->
          <barcode :barcode="order.barcode" :id="`barcodeTag${index}`" />
  
          <!-- Dettagli ordine con bottone di rimozione -->
          <button class="btn btn-success" @click="openModal(order)">INFO</button>
  
          <!-- Bottone per rimuovere l'ordine dal bancale -->
          <button
            type="button"
            @click="palletStore.removeOrder(order.barcode)"
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

      <modalOrderInfo ref="modal" :receiverID="receiver_ID" :senderID="sender_ID" id="modalInfo"/>
    </div>
</template>