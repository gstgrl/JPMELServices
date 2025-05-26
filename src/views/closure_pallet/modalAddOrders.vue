<script setup>
  import { useClients } from '@/services/supabaseFunctions/clients';
  import { useOrders } from '@/services/supabaseFunctions/orders';
  import { usePalletStore } from '@/stores/palletStore';
  import { Modal } from 'bootstrap'
  import { ref, onMounted, handleError } from 'vue';
  import { useToastStore } from '@/stores/toastStore';
  import { useI18n } from 'vue-i18n';
  
  
  const { t } = useI18n();
  const modalRef = ref(null)
  let modalInstance = null

  const palletStore = usePalletStore()
  const toastStore = useToastStore()

  onMounted(() => {
    if(modalRef.value) {
      modalInstance = new Modal(modalRef.value)
    }
  })

  const open = async () => {
    const {data: ordersData, error: ordersError} = await useOrders().getOrders(1)

    if(ordersData) {

      for(let order of ordersData) {
        if(!palletStore.checkAvailability(order.barcode)) {
          const {data: receiverData, error: receiverError} = await useClients().getClient(order.receiver_id)

          if(receiverData) {
            let singleOrder = {
              barcode: order.barcode,
              addressInfo: receiverData.addressInfo,
              package_number: order.package_number
            }

            palletStore.availableOrders.push(singleOrder)
          }
        }
      }

      modalInstance?.show()

    } else {
      console.error(ordersError)
    }
  }

  const close = () => modalInstance?.hide()

  defineExpose({ open })

  

  const handleCheckboxChange = (order) => {
    const isChecked = palletStore.orderChecked[order.barcode];
    
    if (isChecked) {
      palletStore.addOrder(order)
      toastStore.show(t('messages.orderAddedToPallet'))
    } else {
      palletStore.removeOrder(order.barcode)
      toastStore.show(t('messages.orderRemovedFromPallet'))
    }
  }
</script>

<template>
  <div class="modal fade" id="modalAddOrdersID" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalAddOrders">Aggiungi Ordini</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div v-for="(order) in palletStore.availableOrders">
            <input type="checkbox" :id="`checkbox-${order.barcode}`" v-model="palletStore.orderChecked[order.barcode]" @change="handleCheckboxChange(order)">
            {{ order.barcode }} - {{ order.addressInfo.address }}, {{ order.addressInfo.city }}, {{ order.addressInfo.province }} - {{ order.package_number }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">{{ $t('palletClosure.closeModal') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>