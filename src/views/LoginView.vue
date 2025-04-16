<script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const email = ref("")
    const password = ref("")

    const router = useRouter();

    const login = async () => {
        try {
          await authStore.login(email.value, password.value);  // Chiamata al login
          router.push("/dashboard");
            
        } catch (error) {
          console.error("Errore nel login", error)
        }
    };
</script>

<template>
  <div class="container mt-5">
    <h2>{{ $t('accessWords.login') }}</h2>
    <form @submit.prevent="login">

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="email"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">{{ $t('accessWords.login') }}</button>
    </form>
  </div>
</template>