<script setup>
    import { ref, nextTick } from "vue";
    import { useOrderStore } from "@/stores/orderStore";
    import modalComponent from "./modalComponent.vue";
    import reserchInput from "./reserchInput.vue";
    import orderInfo from "./orderInfo.vue";

    const modal = ref(null)

    const modalType = ref('')
    const modalTitle = ref('')
    const orderStore = useOrderStore()

    const openModal = async (type) => {
        modalType.value = type
        
        if(type == 'sender') {
            modalTitle.value = "Crea Mittente"
        } else {
            modalTitle.value = "Crea Destinatario" 
        }
        await nextTick()

        modal.value.open()
    }

</script>

<template>
    <div class="container mt-3">
        <div class="row main-div">

            <div class="col-5 mb-4">
                <div class="row">
                    <div class="col">
                        <div class="d-flex flex-row align-items-center">
                            <button class="btn btn-secondary custom-button me-2" @click="openModal('sender')"><font-awesome-icon :icon="['fas', 'plus']" /></button>
                            <reserchInput input-type="sender" :input-title="$t('orderCreation.sender')"/>
                        </div>

                        <div class="mt-2">
                            <h6 class="text-muted mb-2">{{ $t('orderCreation.sender') }}</h6>
                            <p><strong>{{ $t('orderCreation.placeholderNameReciver') }}:</strong> {{ orderStore.currentOrder.sender.name }} {{ orderStore.currentOrder.sender.surname }}</p>
                            <p><strong>Email:</strong> {{ orderStore.currentOrder.sender.email }}</p>
                            <p><strong>{{ $t('orderCreation.phoneNumber') }}:</strong> {{ orderStore.currentOrder.sender.phone }}</p>
                            <p><strong>{{ $t('orderCreation.address') }}:</strong> {{ orderStore.currentOrder.sender.addressInfo.address }}</p>
                            <p><strong>{{ $t('orderCreation.province') }}:</strong> {{ orderStore.currentOrder.sender.addressInfo.province }}</p>
                            <p><strong>{{ $t('orderCreation.city') }}:</strong> {{ orderStore.currentOrder.sender.addressInfo.city }}</p>
                            <p><strong>{{ $t('orderCreation.zipCode') }}:</strong> {{ orderStore.currentOrder.sender.addressInfo.zipCode }}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div class="col-5 mb-4">
                <div class="row">
                    <div class="col">
                        <div class="d-flex flex-row align-items-center">
                            <reserchInput input-type="receiver" :input-title="$t('orderCreation.receiver')"/>
                            <button class="btn btn-secondary custom-button ms-2" @click="openModal('receiver')"><font-awesome-icon :icon="['fas', 'plus']" /></button>
                        </div>

                        <div class="mt-2">
                            <h6 class="text-muted mb-2">{{ $t('orderCreation.receiver') }}</h6>
                            <p><strong>{{ $t('orderCreation.placeholderNameReciver') }}:</strong> {{ orderStore.currentOrder.receiver.name }} {{ orderStore.currentOrder.receiver.surname }}</p>
                            <p><strong>Email:</strong> {{ orderStore.currentOrder.receiver.email }}</p>
                            <p><strong>{{ $t('orderCreation.phoneNumber') }}:</strong> {{ orderStore.currentOrder.receiver.phone }}</p>
                            <p><strong>{{ $t('orderCreation.address') }}:</strong> {{ orderStore.currentOrder.receiver.addressInfo.address }}</p>
                            <p><strong>{{ $t('orderCreation.province') }}:</strong> {{ orderStore.currentOrder.receiver.addressInfo.province }}</p>
                            <p><strong>{{ $t('orderCreation.city') }}:</strong> {{ orderStore.currentOrder.receiver.addressInfo.city }}</p>
                            <p><strong>{{ $t('orderCreation.zipCode') }}:</strong> {{ orderStore.currentOrder.receiver.addressInfo.zipCode }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-2">
                <orderInfo />
            </div>
        </div>
    </div>

    

    <modalComponent ref="modal" modal-id="dettagliModal" :title="modalTitle" :modal-type="modalType" v-if="modalType"/>
  </template>


<style scoped>
    @media (max-width: 1023px) {
        .main-div {
            flex-direction: column;
            align-items: center;
        }

        .col-5 {
            width: 100%;
        }

        .col-2 {
            width: 100%;
        }
    }
</style>