<script setup>
  import { RouterView } from "vue-router";
  import navbar from "@/components/navbar.vue";

</script>

<template>
    <navbar />
    <RouterView />
</template>

<style>
  body {
    font-family: Arial, sans-serif;
  }
</style>
