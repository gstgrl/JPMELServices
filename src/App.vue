<script setup>
  import { RouterView } from "vue-router";
  import { useAuthStore } from "./stores/auth";
  import { useRoute } from 'vue-router'
  import navbar from "@/components/layout/navbar.vue";

  const route = useRoute()
  const authStore = useAuthStore()

</script>

<template>
    <navbar v-if="!route.meta.hideNavbar"/>
    <RouterView />
</template>

<style>
  body {
    font-family: Arial, sans-serif;
  }
</style>
