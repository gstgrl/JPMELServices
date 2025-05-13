<script setup>
    import { ref } from 'vue';
    import badge from './badge.vue';
    import modalDelivery from './modalDelivery.vue';

    const props = defineProps({
      item: {
        type: Object,
        required: true
      }
    });

    const modal = ref(null)
    const viewButton = ref(true)
    
    const openModal = async () => {modal.value.open()}

    const handleDeliveredStatus = (result) => {
      if(result) {
        viewButton.value = false
      }
    }
</script>


<template>
    <div class="card my-2 w-75">
        <div class="card-header d-flex justify-content-between">
            <div class="header-info">
                <strong>{{ item.addressInfo.address }}</strong> - 📄 {{ item.barcode }} - 📦 {{ item.package_number }}
            </div>

            <button class="btn" @click="openModal"><font-awesome-icon :icon="['fas', 'truck']" v-if="item.delivery_status != 'delivered'"/></button>
        </div>
    </div>

    <modalDelivery ref="modal" :addressInfo="item.addressInfo" :barcode="item.barcode" :delivery_status="item.delivery_status" @order-delivered="handleDeliveredStatus"/>
</template>

<style scoped>


  @media (max-width: 450px) {

    .header-info {
      display: flex;
      flex-direction: column;
    }
  }

  @media (max-width: 1024px) {

    .card {
      width: 100% !important;
    }
  }
</style>