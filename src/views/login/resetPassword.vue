<script setup>
  import { ref } from "vue";
  import { supabase } from "@/services/supabase"; // Assicurati che questo punto venga configurato correttamente
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth";

  const router = useRouter();
  const authStore = useAuthStore()

  const password = ref("");
  const confirmPassword = ref("");
  const errorMessage = ref("");
  const successMessage = ref("");

  // Funzione per gestire il reset della password
  const resetPassword = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Le password non coincidono.";
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: password.value });

      if (error) {
        errorMessage.value = error.message;
      } 

      successMessage.value = "Password modificata con successo!";

      await authStore.logout()
      router.push("/login");
    } catch (error) {

      errorMessage.value = "Errore inatteso durante il reset della password.";
      console.error(error)
    }
  };

  console.log(supabase)
</script>

<template>
    <div class="container">

      <div class="alert alert-danger mt-3" role="alert" v-if="errorMessage">
          {{ errorMessage }}
      </div>

      <div class="alert alert-success mt-3" role="alert" v-if="successMessage">
          {{ successMessage }}
      </div>

      <h2>Imposta una nuova password</h2>
      <form @submit.prevent="resetPassword">
        <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control m-1"
              v-model="password"
              placeholder="Email"
              id="password"
              required
            />
          <label for="password">Password</label>
        </div>

        <div class="form-floating mb-3">
          <input
              type="password"
              class="form-control m-1"
              v-model="confirmPassword"
              placeholder="Conferma la Password"
              id="emaconfirmPasswordil"
              required
          />
          <label for="confirmPassword">Conferma la Password</label>
        </div>

        <button type="submit" class="btn btn-primary">Imposta la nuova password</button>
      </form>
    </div>
</template>

  