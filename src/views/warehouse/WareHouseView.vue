<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useRouter } from 'vue-router';

    import { usePallets } from '@/services/supabaseFunctions/pallets';
    import { useOrders } from '@/services/supabaseFunctions/orders';
    import { useStatusLog } from '@/services/supabaseFunctions/statusLog';

    import { useDeliveryPool } from '@/stores/deliveryPoolStore';
    import { useWareHouseStore } from '@/stores/warehouseStore';
    import { useToastStore } from '@/stores/toastStore';

    const warehouseStore = useWareHouseStore()
    const deliveryPoolStore = useDeliveryPool()
    const toastStore = useToastStore()
    const router = useRouter()

    const palletIDFromInput = ref('')
    const filters = ref({
        province: '',
        city: ''
    })

    //Vue methods
    onMounted(async() => {
        const {data: orders, error: errorOrders} = await useOrders().getOrders(3, null)
        if(errorOrders)  {
            toastStore.show('Error during fetching order', 'danger')
            throw new Error(`Error during fetching orders: ${errorOrders.message}`)
        }

        await warehouseStore.fetchOrders(null, orders)
    })

    watch(filters, () => {warehouseStore.filterOrder(filters.value)}, {deep: true, immediate: true})



    //Implemented methods
    const pushPallet = async() => {
        if(!palletIDFromInput.value) {
            toastStore.show('Inserire un codice pallet valido!', 'warning')
            palletIDFromInput.value = ''
            return
        }

        const result = await usePallets().returnPalletStatus(palletIDFromInput.value)

        if(!result) {
            toastStore.show('Bancale gia scaricato!', 'warning')
            palletIDFromInput.value = ''
            return
        }

        const {data: palletData, error: palletError} = await usePallets().updatePallet(palletIDFromInput.value, {status: 'discharged'})
        if(palletError)  {
            toastStore.show('Error during pallet discharging action', 'danger')
            throw new Error(`Error during pallet discharging action: ${palletError.message}`)
        }

        const {data: dataOrder, error: errorUpdate} = await useOrders().updateOrder(null, null, palletIDFromInput.value, {status: 3})
        if(errorUpdate)  {
            toastStore.show('Error during update order info', 'danger')
            throw new Error(`Error during update order info: ${errorUpdate.message}`)
        }

        for(let order of dataOrder) {
            //Creo un nuovo log di stato avanzamento consegna
            const {data: log, error: errorLog} = await useStatusLog().createLog({order_id: order.id, barcode: order.barcode, status: 'Order arrived in Domenican Republic'})
            if(errorLog)  {
                toastStore.show('Error during creating order delivery status history log', 'danger')
                throw new Error(`Error during creating order delivery status history log: ${errorLog.message}`)
            }
        }

        await warehouseStore.fetchOrders(palletIDFromInput.value, null)
        palletIDFromInput.value = ''
        toastStore.show('Bancale scaricato correttamente', 'success')
    }

    const resetFilters = () => {
        filters.value.city = ''
        filters.value.province = ''
    }  

    const handleCheckboxChange = (order) => {
        const isChecked = warehouseStore.ordersChecked[order.barcode]

        if(isChecked) {
            warehouseStore.addOrder(order)
            toastStore.show('Ordine agginto', 'primary', 2500)
        } else {
            warehouseStore.removeOrder(order.barcode)
            toastStore.show('Ordine rimosso', 'primary', 2500)
        }
    }

    const pushToDelivery = async() => {
        router.push('/delivery')
        await deliveryPoolStore.startDelivery(warehouseStore.ordersSelected)
        warehouseStore.resetPinia()
    }
</script>

<template>
    <div class="container">
        <div class="row justify-content-between">
            <div class="form-floating my-3  palletID-input-row">
                <input type="text" class="form-control" id="palletID" placeholder="Pallet ID" v-model="palletIDFromInput" @keyup.enter="pushPallet">
                <label for="palletID">Pallet ID</label>
            </div>

            <div class="button-filters-div">
                <div class="filter-div">
                    <select class="form-select my-1" aria-label="Default select example" v-model="filters.province">
                        <option value="" selected disabled>Provincia</option>
                        <option :value="`${province}`" v-for="(province) in warehouseStore.provinces">{{ province }}</option>
                    </select>

                    <select class="form-select my-1" aria-label="Default select example" v-model="filters.city">
                        <option value="" selected disabled>Città</option>
                        <option :value="`${city}`" v-for="(city) in warehouseStore.cities" :hidden="filters.province && !warehouseStore.cityBelongsToProvince(city, filters.province)"> {{ city }} </option>
                    </select>
                </div>


                <button class="btn custom-btn" type="button" @click="resetFilters" v-if="filters.city || filters.province">
                    <font-awesome-icon :icon="['fas', 'eraser']" />
                </button>
            </div>
        </div>

        <div class="row">

            <div class="col-6">
                <div><h5>Ordini in Magazzino</h5></div>
                
                <div class="card my-2 w-75" v-for="(order) in warehouseStore.filteredOrders">
                    <div class="card-header d-flex justify-content-between">
                        <div class="header-info">
                            <strong>📄 {{ order.barcode }}</strong> - {{ order.addressInfo.address }}
                        </div>

                        <div>
                            📦 {{ order.package_number }}
                        </div>
                    </div>
                    <div class="card-body d-flex justify-content-between">
                        <div>
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

                        <div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" :id="`checkbox-${order.barcode}`" v-model="warehouseStore.ordersChecked[order.barcode]" @change="handleCheckboxChange(order)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-6">
                <div><h5>Ordini Selezionati</h5></div>

                <button class="btn btn-success" v-if="!warehouseStore.ordersSelected.length == 0" type="button" @click="pushToDelivery">Vai in Consegna</button>
                
                <div class="card my-2 w-75" v-for="(order) in warehouseStore.ordersSelected">
                    <div class="card-header d-flex justify-content-between">
                        <div class="header-info">
                            <strong>📄 {{ order.barcode }}</strong> - {{ order.addressInfo.address }}
                        </div>

                        <div>
                            📦 {{ order.package_number }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
  .palletID-input-row {
    width: 50%;
  }

  .card-body-order-info {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .button-filters-div {
    display: flex;
    flex-direction: row;
    width: fit-content;
  }

  .filter-div {
    display: flex;
    flex-direction: column;
    width: fit-content;
    align-items: center;
    justify-content: center;
  }

  .custom-btn {
    width: fit-content;
  }


  @media (max-width: 450px) {

    .header-info {
      display: flex;
      flex-direction: column;
    }
  }

  @media (max-width: 1024px) {

    .palletID-input-row {
      width: 90%;
    }

    .button-div {
      flex-direction: column;
      justify-content: space-evenly;
      margin-top: 1rem;
    }

    .col-6 {
      width: 100%;
    }

    .card {
      width: 100% !important;
    }
  }
</style>