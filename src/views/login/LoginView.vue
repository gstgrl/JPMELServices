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
          const result = await authStore.login(email.value, password.value);  // Chiamata al login

          if(result) {
            router.push("/dashboard");
          } else {
            // Se il login è fallito, mostra il messaggio di errore dallo store
            alert(authStore.errorMessage || "Credenziali errate.");
          }
            
        } catch (error) {
          alert("Si è verificato un errore durante il login.");
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

      <RouterLink to="/forgot"><h6>Recupera Password</h6></RouterLink>

      <button type="submit" class="btn btn-primary mt-3">{{ $t('accessWords.login') }}</button>
    </form>
  </div>
</template>