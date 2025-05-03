<script setup>
    import { ref } from "vue";
    import { supabase } from "@/services/supabase"; // Assicurati che questo punto venga configurato correttamente
    import { useRoute, useRouter } from "vue-router";

    // Ottieni il token dal link di reset
    const route = useRoute();
    const router = useRouter();

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

    const { error } = await supabase.auth.api
        .updateUser(route.query.token, { password: password.value });

    if (error) {
        errorMessage.value = error.message;
    } else {
        successMessage.value = "Password modificata con successo!";
        router.push("/login");
    }
    };
</script>

<template>
    <div>
      <h2>Imposta una nuova password</h2>
      <form @submit.prevent="resetPassword">
        <div class="form-group">
          <label for="password">Nuova Password:</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Nuova password"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Conferma Password:</label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            placeholder="Conferma la password"
            required
          />
        </div>
        <button type="submit">Imposta la nuova password</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </form>
    </div>
</template>

  