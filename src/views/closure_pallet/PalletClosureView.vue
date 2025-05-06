<script setup>
  import './style.css'
  import { ref, watch, nextTick } from 'vue';
  import { useRouter } from "vue-router";
  import { useOrders } from '@/services/supabaseFunctions/orders';
  import { useClients } from '@/services/supabaseFunctions/clients';
  import modalAddOrders from './modalAddOrders.vue';
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
  
  const barcodeFromInput = ref("")
  const modal = ref(null)

  const openCreationPalletModal = () => {
    modal.value.open()
  }

  const closePallet = () => {
    console.log("Pallet chiuso con successo", palletStore.orders)
    palletStore.resetPalletStore()
  }

  const pushOrder = async() => {
    if(!barcodeFromInput.value) {
      barcodeFromInput.value = ''
      window.alert("Inserisci un barcode!")
      return
    }

    if(palletStore.checkAlreadyIn(barcodeFromInput.value)) {
      barcodeFromInput.value = ''
      window.alert("Ordine gia selezionato!")
      return
    }

    const {data: orderData, error: orderError} = await useOrders().getOrder(barcodeFromInput.value, 1)

    if(orderData) {
      const {data: receiverData, error: receiverError} = await useClients().getClient(orderData.receiver_id)

      if(receiverData) {
        let singleOrder = {
          barcode: barcodeFromInput.value,
          addressInfo: receiverData.addressInfo,
          package_number: orderData.package_number
        }

        palletStore.addOrder(singleOrder)
        palletStore.orderChecked[barcodeFromInput.value] = true
      }

      barcodeFromInput.value = ''
    }
    
  }
</script>


<template>
  <div class="container">
    <div class="row barcode-input-row">
      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="barcodeInput" placeholder="barcode" v-model="barcodeFromInput" @keyup.enter="pushOrder(barcodeFromInput)">
        <label for="barcodeInput">Barcode</label>
      </div>
    </div>

    <div class="row custom-style">
      <div class="col-9">
        <div><h5>Ordini Selezionati</h5></div>
        <div v-for="(order) in palletStore.orders">
          {{ order }}
        </div>
      </div>
      <div class="col-3">
        <!-- Button trigger modal -->
         <div class="d-flex button-div">
            <button type="button" class="btn btn-primary my-2" @click="openCreationPalletModal" v-if="palletStore.orders.length == 0">
              Crea Bancale
            </button>
            
            <button type="button" class="btn btn-primary my-2" @click="openCreationPalletModal" v-else>
              Aggiungi ordini
            </button>

            <button type="button" class="btn btn-warning my-2" @click="closePallet">
              Chiudi Bancale
            </button>
         </div>
      </div>
    </div>

    <!-- Modal -->
     <modalAddOrders ref="modal"/>
  </div>
</template>

<style scoped>

  .barcode-input-row {
    width: 50%;
  }

  .custom-style {
    width: 100%;
  }

  .button-div {
    flex-direction: column;
    justify-content: space-around;
  }

  @media (max-width: 1024px) {

    .barcode-input-row {
      width: 90%;
    }

    .row {
      flex-direction: column ;
    }

    .button-div {
      flex-direction: row;
      justify-content: space-evenly;
      margin-top: 1rem;
    }

    .col-3 {
      width: 100%;
    }
  }
</style>