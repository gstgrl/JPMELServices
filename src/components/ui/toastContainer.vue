<script setup>
    import { useToastStore } from '@/stores/toastStore';
    import { storeToRefs } from 'pinia'

    const toastStore = useToastStore()

    const { toasts } = storeToRefs(toastStore)
    const { remove } = toastStore
</script>

<!-- components/ToastContainer.vue -->
<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
    <div
      class="toast show align-items-center text-black border-0 mb-2"
      :class="`bg-${toast.type}`"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      v-for="toast in toasts"
      :key="toast.id"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ toast.message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Close"
          @click="remove(toast.id)"
        ></button>
      </div>
    </div>
  </div>
</template>
