<script setup>
  import { ref } from 'vue';
  import { generateQrCode } from '@/services/generateCodes';

  //Supabase functions
  import { useOrders } from '@/services/supabaseFunctions/orders';
  import { useClients } from '@/services/supabaseFunctions/clients';
  import { usePallets } from '@/services/supabaseFunctions/pallets';

  //Components
  import modalAddOrders from './modalAddOrders.vue';

  //Pinia Stores
  import { usePalletStore } from '@/stores/palletStore';

  //Pinia stores intialization
  const palletStore = usePalletStore()
  
  const barcodeFromInput = ref("")
  const modal = ref(null)

  const openCreationPalletModal = async(status) => {
    if(status == 'create') {
      const {data: palletData, error: palletError} = await usePallets().createPallet({status: 'draft'})
      if(palletData) {
        palletStore.palletId = palletData.id
        modal.value.open()
      }

    } else {
      modal.value.open()
    }
  }

  const closePallet = async() => {
    const {data: palletData, error: palletError} = await usePallets().updatePallet(palletStore.palletId, {status: 'closed'})

    if(palletError) {
      console.error(palletError)
      return
    }

    for(let order of palletStore.orders) {
      if(!order.barcode) continue;

      const {data, error: orderError} = await useOrders().updateOrder(null, order.barcode, null, {pallet_id: palletStore.palletId, status: 2})

      if(orderError) {
        console.error(`Errore aggiornando l'ordine ${order.barcode}:`, orderError)
      }
    }

    generateQrCode(palletStore.palletId)

    palletStore.resetPalletStore()
  }

  const undoPallet = async() => {
    const {data, error: deletePalletError} = await usePallets().deletePallet(palletStore.palletId)

    if(deletePalletError) {
      console.error(`Errore nell'eleminazione del bancale ${palletStore.palletId}:`, deletePalletError)
    }

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

    if(orderError) {
      console.error(orderError)
    }

    const {data: receiverData, error: receiverError} = await useClients().getClient(orderData.receiver_id)
    
    if(receiverError) {
      console.error(receiverError)
    }

    let singleOrder = {
      barcode: barcodeFromInput.value,
      addressInfo: receiverData.addressInfo,
      package_number: orderData.package_number
    }

    palletStore.addOrder(singleOrder)
    palletStore.orderChecked[barcodeFromInput.value] = true
    

    barcodeFromInput.value = ''
  }
</script>


<template>
  <div class="container">
    <div class="row" v-if="palletStore.palletId">
      <div class="form-floating my-3 mx-auto barcode-input-row">
        <input type="text" class="form-control" id="barcodeInput" placeholder="barcode" v-model="barcodeFromInput" @keyup.enter="pushOrder()">
        <label for="barcodeInput">Barcode</label>
      </div>
    </div>

    <div class="row custom-style my-2">
      <div class="col-9">
        <div><h5>Ordini Selezionati</h5></div>
        
        <div class="card my-2 w-75" v-for="(order) in palletStore.orders">
          <div class="card-header d-flex justify-content-between">
            <div class="header-info">
              <strong>📄 {{ order.barcode }}</strong> - {{ order.addressInfo.address }}
            </div>

            <div>
              📦 {{ order.package_number }}
            </div>
          </div>
          <div class="card-body">
            <div class="card-body-order-info">
              <h6>Città:</h6>
              <p class="card-text ms-2">{{ order.addressInfo.city }}</p>
            </div>

            <div class="card-body-order-info">
              <h6>Provincia:</h6>
              <p class="card-text ms-2">{{ order.addressInfo.province }}</p>
            </div>

            <div class="card-body-order-info">
              <h6>CAP:</h6>
              <p class="card-text ms-2">{{ order.addressInfo.zipCode }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <!-- Button trigger modal -->
         <div class="d-flex button-div">
            
            <button type="button" class="btn btn-primary my-2" @click="openCreationPalletModal('create')" v-if="!palletStore.palletId">
              Crea Bancale
            </button>

            <div class="d-flex justify-content-between button-group-div" v-else>
              <button type="button" class="btn btn-primary my-2" @click="openCreationPalletModal('add')">
                Aggiungi ordini
              </button>

              <button type="button" class="btn btn-danger my-2" @click="undoPallet">
                Annulla creazione
              </button>
            </div>

            <button type="button" class="btn btn-success my-2 close-pallet-button" @click="closePallet" v-if="palletStore.palletId">
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

  .card-body-order-info {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .button-div {
    flex-direction: column;
    justify-content: space-around;
  }

  @media (max-width: 450px) {

    .header-info {
      display: flex;
      flex-direction: column;
    }
  }

  @media (max-width: 1024px) {

    .barcode-input-row {
      width: 90%;
    }

    .row {
      flex-direction: column ;
    }

    .button-div {
      flex-direction: column;
      justify-content: space-evenly;
      margin-top: 1rem;
    }

    .button-group-div {
      display: flex;
      flex-direction: row;
    }

    .col-3, 
    .col-9 {
      width: 100%;
    }

    .card {
      width: 100% !important;
    }
  }
</style>