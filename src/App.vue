<script setup>
  import { RouterView } from "vue-router";
  import { useRoute } from 'vue-router'
  import navbar from "@/components/layout/navbar.vue";
  import customerNavbar from "./components/layout/customerNavbar.vue";
  import toastContainer from "./components/ui/toastContainer.vue";

  const route = useRoute()

</script>

<template>
    <customerNavbar v-if="route.meta.hideNavbar"/>
    <navbar v-else/>
    <RouterView />
    <toastContainer />
</template>

<style>
  body {
    font-family: Arial, sans-serif;
  }
</style>
