<script setup>
  import { RouterView } from "vue-router";
  import navbar from "@/components/layout/navbar.vue";
  import { useAuthStore } from "./stores/auth";

  const authStore = useAuthStore()

</script>

<template>
    <navbar v-if="!authStore.isRecovering"/>
    <RouterView />
</template>

<style>
  body {
    font-family: Arial, sans-serif;
  }
</style>
