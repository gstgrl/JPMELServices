<script setup>
    import { useClients } from '@/services/supabaseFunctions/clients';
    import { Modal } from 'bootstrap'
    import { onMounted, ref } from 'vue';

    const props = defineProps({
        senderID: {
            type: String,
            required: true
        },
        receiverID: {
            type: String,
            required: true
        }
    })

    const modalRef = ref(null)
    const sender = ref({})
    const receiver = ref({})

    let modalInstance = null

    onMounted(async() => {
        if (modalRef.value) {
            modalInstance = new Modal(modalRef.value)
        }
    })

    const open = async() => {
        if(!props.senderID || !props.receiverID) {
            console.error('ID mittente o ID destinatario mancanti')
            return
        }

        const {data: senderData, error: senderError} = await useClients().getClient(props.senderID)
        const {data: receiverData, error: receiverError} = await useClients().getClient(props.receiverID)

        if (senderError || receiverError) {
            console.error('Errore nel recupero dati:', senderError || receiverError)
            return
        }

        sender.value = senderData
        receiver.value = receiverData 

        modalInstance?.show()
    }

    const close = () => modalInstance?.hide()

    defineExpose({ open })    
</script>

<template>
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">INFO</h5>
          <button class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi" @click="close"></button>
        </div>
        <div class="modal-body">      
            <div class="my-2" v-if="sender.addressInfo">
                <h6 class="text-muted">{{ $t('orderCreation.sender') }}</h6>
                <p><strong>{{ $t('orderCreation.placeholderNameReciver') }}:</strong> {{ sender.name }} {{ sender.surname }}</p>
                <p><strong>{{ $t('orderCreation.address') }}:</strong> {{ sender.addressInfo.address }}</p>
                <p><strong>{{ $t('orderCreation.province') }}:</strong> {{ sender.addressInfo.province }}</p>
                <p><strong>{{ $t('orderCreation.city') }}:</strong> {{ sender.addressInfo.city }}</p>
            </div>

            <div class="mb-2" v-if="receiver.addressInfo">
                <h6 class="text-muted">{{ $t('orderCreation.receiver') }}</h6>
                <p><strong>{{ $t('orderCreation.placeholderNameReciver') }}:</strong> {{ receiver.name }} {{ receiver.surname }}</p>
                <p><strong>{{ $t('orderCreation.address') }}:</strong> {{ receiver.addressInfo.address }}</p>
                <p><strong>{{ $t('orderCreation.province') }}:</strong> {{ receiver.addressInfo.province }}</p>
                <p><strong>{{ $t('orderCreation.city') }}:</strong> {{ receiver.addressInfo.city }}</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  