<template>
    <div v-if="visible" class="popup">
      {{ message }}
    </div>
</template>

<script setup>
    import { ref } from "vue";

    const visible = ref(false);
    const message = ref("");

    const showPopup = (msg) => {
        message.value = msg;
        visible.value = true;

        setTimeout(() => {
        visible.value = false;
        }, 2200); // Nasconde il popup dopo 3 secondi
    };

    defineExpose({ showPopup });
</script>

<style scoped>
    .popup {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease-in-out;
    }
</style>
  