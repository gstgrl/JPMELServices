<script setup>
    import { ref } from 'vue';
    import badge from './badge.vue';
    import { useDeliveryPool } from '@/stores/deliveryPoolStore';
    import signaturePad from '@/components/ui/signaturePad.vue';

    const props = defineProps({
        item: {
            type: Object,
            required: true
        }
    });

    const deliveryPoolStore = useDeliveryPool()
    const showSigaturePad = ref(false)

    const startSignature = async () => {
        const signed = true

        if (signed) {deliveryPoolStore.orderDeliveredFunction(props.item, )}
    };

    const rescheduleDelivery = async () => {
        deliveryPoolStore.orderRescheduled(props.item)
    };

    const handleSignature = async (signatureDataUrl) => {
        deliveryPoolStore.orderDeliveredFunction(props.item, signatureDataUrl)
    }
</script>


<template>
    <div class="accordion" id="orderItemAccordion" >
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed accordion-head" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapseOne-' + item.barcode" aria-expanded="false" :aria-controls="'collapseOne-' + item.barcode">
                    <p class="barcode-info">📄 {{ $t('warehouse.barcodeText') }}: {{ item.barcode }}</p>
                    <badge :order-status="item.data.deliveryStatus"/>
                </button>
            </h2>

            <div :id="'collapseOne-' + item.barcode" class="accordion-collapse collapse" data-bs-parent="#orderItemAccordion">
                <div class="accordion-body">

                    <div class="row mb-3">
                        <div class="col-md-6 mb-4 mb-md-0">
                            <h6 class="text-muted">{{ $t('orderCreation.sender') }}</h6>
                            <p><strong>{{ $t('orderCreation.placeholderNameReciver') }}:</strong> Azienda XYZ</p>
                        </div>

                        <div class="col-md-6">
                            <h6 class="text-muted">{{ $t('orderCreation.receiver') }}</h6>
                            <p><strong>{{ $t('orderCreation.placeholderNameReciver') }}:</strong> {{ item.data.name }} {{ item.data.surname }}</p>
                            <p><strong>{{ $t('orderCreation.address') }}:</strong> {{ item.data.address }}</p>
                            <p><strong>{{ $t('orderCreation.province') }}:</strong> {{ item.data.province }}</p>
                            <p><strong>{{ $t('orderCreation.city') }}:</strong> {{ item.data.city }}</p>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end gap-3 mt-4" v-if="item.data.deliveryStatus != 'delivered'">
                        <!-- Firma e consegna -->
                        <button class="btn btn-success" @click="showSigaturePad = true">
                            ✍️ {{ $t('delivery.buttons.signatureButton') }}
                        </button>

                        <!-- Nessuno in casa -->
                        <button class="btn btn-warning" @click="rescheduleDelivery()" v-if="item.data.deliveryStatus != 'rescheduled'">
                            ⏳ {{ $t('delivery.buttons.rescheduleButton') }}
                        </button>
                    </div>

                    <signaturePad :barcode="item.barcode" @signature-confirmed="handleSignature" v-if="showSigaturePad"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

</style>