// stores/toastStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

let idCounter = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  const show = (message, type = 'success', duration = 4500) => {
    const id = idCounter++
    toasts.value.push({ id, message, type })

    // Auto-rimuove dopo durata specificata
    if(duration > 0) {
        setTimeout(() => remove(id), duration)
    }
  }

  const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, show, remove }
})
