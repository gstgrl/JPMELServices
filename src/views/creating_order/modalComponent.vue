<script setup>
  import { onMounted, ref } from 'vue'
  import { Modal } from 'bootstrap'
  import { useOrderStore } from '@/stores/orderStore'
  import { useClients } from '@/services/supabaseFunctions/clients'

  const orderStore = useOrderStore()

  const props = defineProps({
    title: { type: String, default: 'Titolo' },
    modalType: { type: String, required: true }
  })

  const modalRef = ref(null)
  let modalInstance = null

  onMounted(() => {
    if (modalRef.value) {
      modalInstance = new Modal(modalRef.value)
    }
  })

  const open = () => modalInstance?.show()
  const close = () => modalInstance?.hide()

  const saveClients = async() => {
    close()
    await useClients().createClient(orderStore.currentOrder[props.modalType])
  }

  defineExpose({ open })
</script>

<template>
  <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi" @click="close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveClients">
            <div class="form-floating mb-3">
              <input
                    type="text"
                    class="form-control m-1"
                    v-model="orderStore.currentOrder[props.modalType].name"
                    :placeholder="$t('orderCreation.placeholderNameReciver')"
                    :id="`floatingInput-${modalType}-name`"
                    required
                />
              <label :for="`floatingInput-${modalType}-name`">{{ $t('orderCreation.placeholderNameReciver') }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                    type="text"
                    class="form-control m-1"
                    v-model="orderStore.currentOrder[props.modalType].surname"
                    :placeholder="$t('orderCreation.placeholderSurnameReciver')"
                    :id="`floatingInput-${modalType}-surname`"
                    required
                />
              <label :for="`floatingInput-${modalType}-surname`">{{ $t('orderCreation.placeholderSurnameReciver') }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                    type="email"
                    class="form-control m-1"
                    v-model="orderStore.currentOrder[props.modalType].email"
                    placeholder="Email"
                    :id="`floatingInput-${modalType}-email`"
                    required
                />
              <label :for="`floatingInput-${modalType}-email`">Email</label>
            </div>
            <div class="form-floating mb-3">
              <input
                    type="tel"
                    class="form-control m-1"
                    v-model="orderStore.currentOrder[props.modalType].phone"
                    :placeholder="$t('orderCreation.phoneNumber')"
                    :id="`floatingInput-${modalType}-phone`"
                    required
                />
              <label :for="`floatingInput-${modalType}-phone`">{{ $t('orderCreation.phoneNumber') }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                    type="text"
                    class="form-control m-1"
                    v-model="orderStore.currentOrder[props.modalType].addressInfo.address"
                    :placeholder="$t('orderCreation.address')"
                    :id="`floatingInput-${modalType}-address`"
                    required
                />
              <label :for="`floatingInput-${modalType}-address`">{{ $t('orderCreation.address') }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                    type="text"
                    class="form-control m-1"
                    v-model="orderStore.currentOrder[props.modalType].addressInfo.province"
                    :placeholder="$t('orderCreation.province')"
                    :id="`floatingInput-${modalType}-province`"
                    required
                />
              <label :for="`floatingInput-${modalType}-province`">{{ $t('orderCreation.province') }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                    type="text"
                    class="form-control m-1"
                    v-model="orderStore.currentOrder[props.modalType].addressInfo.city"
                    :placeholder="$t('orderCreation.city')"
                    :id="`floatingInput-${modalType}-city`"
                    required
                />
              <label :for="`floatingInput-${modalType}-city`">{{ $t('orderCreation.city') }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                    type="text"
                    class="form-control m-1"
                    v-model="orderStore.currentOrder[props.modalType].addressInfo.zipCode"
                    :placeholder="$t('orderCreation.zipCode')"
                    :id="`floatingInput-${modalType}-zipCode`"
                    required
                />
              <label :for="`floatingInput-${modalType}-zipCode`">{{ $t('orderCreation.zipCode') }}</label>
            </div>

            
            <button type="submit" class="btn btn-secondary">
              {{ $t('orderCreation.buttons.saveNewClient') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

  