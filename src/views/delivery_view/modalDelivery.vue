<script setup>
    import { onMounted, ref } from 'vue'
    import { Modal } from 'bootstrap'
    import { useDeliveryPool } from '@/stores/deliveryPoolStore';
    import signaturePad from '@/components/ui/signaturePad.vue';
    
    const deliveryPoolStore = useDeliveryPool()
    const emit = defineEmits(['order-delivered'])

    const props = defineProps({
        addressInfo: {
            type: Object,
            required: true
        },
        barcode: {
            type: String,
            required: true
        },
        delivery_status: {
            type: String,
            required: true
        }
    })

    const showSigaturePad = ref(false)
    const modalRef = ref(null)
    let modalInstance = null

    onMounted(() => {
      if (modalRef.value) {
        modalInstance = new Modal(modalRef.value)
      }
    })

    const open = () => modalInstance?.show()
    const close = () => {
        showSigaturePad.value = false
        modalInstance?.hide()
    }

  

    const rescheduleDelivery = async () => {
      deliveryPoolStore.updateBadge(props.barcode, 'rescheduled')
      close()
    }

    const orderDelivered = async (result) => {
      if(result) {
        deliveryPoolStore.updateBadge(props.barcode, 'delivered')
        await deliveryPoolStore.orderDelivered(props.barcode)
        emit('order-delivered', true)
      }

      close()
    }

    defineExpose({ open })
</script>

<template>
  <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">


        <div class="modal-header">
          <button class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi" @click="close"></button>
        </div>

        <div class="modal-body">
            

            <div class="row card-body d-flex justify-content-between">
                <div>
                    <div class="card-body-order-info">
                        <h6>Città:</h6>
                        <p class="card-text ms-2">{{ props.addressInfo.city }}</p>
                    </div>

                    <div class="card-body-order-info">
                        <h6>Provincia:</h6>
                        <p class="card-text ms-2">{{ props.addressInfo.province }}</p>
                    </div>

                    <div class="card-body-order-info">
                        <h6>CAP:</h6>
                        <p class="card-text ms-2">{{ props.addressInfo.zipCode }}</p>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-3 mt-4" v-if="props.delivery_status != 'delivered'">
                </div>
            </div>

            <signaturePad v-if="showSigaturePad" :barcode="props.barcode" @signature-confirmed="orderDelivered"/>


        </div>
        
        <div class="modal-footer">
            <button class="btn btn-warning" @click="rescheduleDelivery" v-if="props.delivery_status != 'rescheduled'">⏳ Riprogramma</button>
            <button class="btn btn-primary" @click="showSigaturePad = true">✍️ Firma</button>
        </div>


      </div>
    </div>
  </div>
</template>

<style scoped>

  .card-body-order-info {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  @media (max-width: 1024px) {

    .col-6 {
      width: 100%;
    }
  }
</style>


  