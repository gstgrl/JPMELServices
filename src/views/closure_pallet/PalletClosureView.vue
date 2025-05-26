<script setup>
  import { ref } from 'vue';
  import { generateQrCode } from '@/services/generateCodes';

  //Supabase functions
  import { useOrders } from '@/services/supabaseFunctions/orders';
  import { useClients } from '@/services/supabaseFunctions/clients';
  import { usePallets } from '@/services/supabaseFunctions/pallets';
  import { useStatusLog } from '@/services/supabaseFunctions/statusLog';

  //Components
  import modalAddOrders from './modalAddOrders.vue';

  //Pinia Stores
  import { usePalletStore } from '@/stores/palletStore';
  import { useToastStore } from '@/stores/toastStore';

  //Pinia stores intialization
  const palletStore = usePalletStore()
  const toastStore = useToastStore()
  
  const barcodeFromInput = ref("")
  const modal = ref(null)

  const openCreationPalletModal = async(status) => {
    if(status == 'create') {
      const {data: palletData, error: palletError} = await usePallets().createPallet({status: 'draft'})
      if(palletError)  {
        toastStore.show('Error during pallet creation action', 'danger')
        throw new Error(`Error during pallet creation action: ${palletError.message}`)
      }

      palletStore.palletId = palletData.id
      modal.value.open()
      
    } else {
      modal.value.open()
    }
  }

  const closePallet = async() => {
    const {data: palletData, error: palletError} = await usePallets().updatePallet(palletStore.palletId, {status: 'closed'})
    if(palletError)  {
      toastStore.show('Error during pallet closure action', 'danger')
      throw new Error(`Error during pallet closure action: ${palletError.message}`)
    }

    for(let order of palletStore.orders) {
      if(!order.barcode) continue;
      
      const {data: dataOrder, error: errorUpdate} = await useOrders().updateOrder(null, order.barcode, null, {pallet_id: palletStore.palletId, status: 2})
      if(errorUpdate)  {
        toastStore.show('Error during update order info', 'danger')
        throw new Error(`Error during update order info: ${errorUpdate.message}`)
      }

      //Creo un nuovo log di stato avanzamento consegna
      const {data: log, error: errorLog} = await useStatusLog().createLog({order_id: dataOrder.id, barcode: order.barcode, status: 'Order shipped by sea'})
      if(errorLog)  {
        toastStore.show('Error during creating order delivery status history log', 'danger')
        throw new Error(`Error during creating order delivery status history log: ${errorLog.message}`)
      }
    }

    generateQrCode(palletStore.palletId)
    toastStore.show('Bancale imballato', 'success')

    palletStore.resetPalletStore()
  }

  const undoPallet = async() => {
    const {data, error: deletePalletError} = await usePallets().deletePallet(palletStore.palletId)
    if(deletePalletError)  {
      toastStore.show('Error during pallet deleting action', 'danger')
      throw new Error(`Error during pallet deleting action: ${deletePalletError.message}`)
    }

    palletStore.resetPalletStore()
  }

  const pushOrder = async() => {
    if(!barcodeFromInput.value) {
        toastStore.show('Inserisci un barcode', 'warning')
      barcodeFromInput.value = ''
      return
    }

    if(palletStore.checkAlreadyIn(barcodeFromInput.value)) {
        toastStore.show('Ordine gia selezionato', 'warning')
      barcodeFromInput.value = ''
      return
    }

    const {data: orderData, error: orderError} = await useOrders().getOrder(barcodeFromInput.value, 1)
    if(orderError)  {
      toastStore.show('Error during fetching data', 'danger')
      throw new Error(`Error during fetching data: ${orderError.message}`)
    }

    const {data: receiverData, error: receiverError} = await useClients().getClient(orderData.receiver_id)
    if(receiverError)  {
      toastStore.show('Error during fetching data', 'danger')
      throw new Error(`Error during fetching data: ${receiverError.message}`)
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
              <h6>{{ $t('addressInfo.city') }}:</h6>
              <p class="card-text ms-2">{{ order.addressInfo.city }}</p>
            </div>

            <div class="card-body-order-info">
              <h6>{{ $t('addressInfo.province') }}:</h6>
              <p class="card-text ms-2">{{ order.addressInfo.province }}</p>
            </div>

            <div class="card-body-order-info">
              <h6>{{ $t('addressInfo.zipCode') }}:</h6>
              <p class="card-text ms-2">{{ order.addressInfo.zipCode }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <!-- Button trigger modal -->
         <div class="d-flex button-div">
            
            <button type="button" class="btn btn-primary my-2" @click="openCreationPalletModal('create')" v-if="!palletStore.palletId">
              {{ $t('palletClosure.createPallet') }}
            </button>

            <div class="d-flex justify-content-between button-group-div" v-else>
              <button type="button" class="btn btn-primary my-2" @click="openCreationPalletModal('add')">
                {{ $t('palletClosure.adOrders') }}
              </button>

              <button type="button" class="btn btn-danger my-2" @click="undoPallet">
                {{ $t('palletClosure.unduCreation') }}
              </button>
            </div>

            <button type="button" class="btn btn-success my-2 close-pallet-button" @click="closePallet" v-if="palletStore.palletId">
              {{ $t('palletClosure.closureButton') }}
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