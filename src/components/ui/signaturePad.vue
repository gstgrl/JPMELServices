<script setup>
    import { onMounted, ref } from 'vue'
    import SignaturePad from 'signature_pad'
  
    const signatureCanvas = ref(null)
    const emit = defineEmits(['signature-confirmed'])
    let signaturePad = null

    const props = defineProps({
        barcode: {
            type: String,
            required: true
        }
    });
  
    onMounted(() => {
        signaturePad = new SignaturePad(signatureCanvas.value)
    })
  
    const clearSignature = () => {
        signaturePad.clear()
    }
  
    const saveSignature = () => {
        if (signaturePad.isEmpty()) {
          alert("Firma vuota!")
        return
    }
    
    const dataUrl = signaturePad.toDataURL()
    emit('signature-confirmed', dataUrl)
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
  