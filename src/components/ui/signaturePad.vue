<script setup>
    import { onMounted, ref } from 'vue'
    import { supabase } from '@/services/supabase'
    import { useOrders } from '@/services/supabaseFunctions/orders'
    import { useStatusLog } from '@/services/supabaseFunctions/statusLog'
    import SignaturePad from 'signature_pad'

    const props = defineProps({
      barcode: {
        type: String,
        required: true
      }
    })


    const emit = defineEmits(['signature-confirmed'])
    const signatureCanvas = ref(null)
    let signaturePad = null
  
    onMounted(() => {
      signaturePad = new SignaturePad(signatureCanvas.value)
    })
  
    const clearSignature = () => {
      signaturePad.clear()
    }
  
    const saveSignature = async() => {
      // 1. Controllo se presente una firma
      if (signaturePad.isEmpty()) {
        alert("Firma vuota!")
        return
      }
      
      const dataUrl = signaturePad.toDataURL('image/png')

      // 2. Converti in Blob per Supabase Storage
      const blob = await (await fetch(dataUrl)).blob()
      const fileName = `firma-${props.barcode}.png`

      // 3. Upload su Supabase Storage
      const { data, error } = await supabase.storage.from('signatures').upload(fileName, blob, {contentType: 'image/png', upsert: true})
      if(error) throw new Error(`Error upload: ${error.message}`)

      // 4. Ottieni URL pubblico
      const { data: publicUrlData } = supabase.storage.from('signatures').getPublicUrl(fileName)
      const firmaUrl = publicUrlData.publicUrl

      // 5. Aggiorno l'ordine e aggiungo l'url della firma
      const {data:updateOrderSignature, error:errorDuringUpdate} = await useOrders().updateOrder(null, props.barcode, null, {status: 5, signature_url: firmaUrl})
      if(errorDuringUpdate) throw new Error(`Error during signature update: ${errorDuringUpdate.message}`)

      
      emit('signature-confirmed', true)
    }
</script>

<template>
  <div class="signature-container">
    <canvas ref="signatureCanvas" class="signature-canvas"></canvas>
    <div class="btn-group mt-2">
      <button class="btn btn-secondary" @click="clearSignature">Cancella</button>
      <button class="btn btn-primary" @click="saveSignature">Conferma</button>
    </div>
  </div>
</template>
  
<style scoped>
  .signature-container {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    max-width: auto;
    margin: auto;
    margin-top: 1rem;
  }
  
  .signature-canvas {
    width: 100%;
    height: 200px;
    border: 1px dashed #666;
  }
</style>
  