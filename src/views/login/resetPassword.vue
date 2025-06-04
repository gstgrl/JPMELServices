<script setup>
  import { ref } from "vue";
  import { supabase } from "@/services/supabase"; // Assicurati che questo punto venga configurato correttamente
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  import { useToastStore } from "@/stores/toastStore";

  const router = useRouter();
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  const password = ref("");
  const confirmPassword = ref("");

  // Funzione per gestire il reset della password
  const resetPassword = async () => {

    if (password.value !== confirmPassword.value) {
      toastStore.show('Le password non coincidono', 'warning')
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: password.value });
      if(error)  {
        toastStore.show('Error during updateing user info', 'danger')
        throw new Error(`Error during updateing user info: ${error.message}`)
      }

      toastStore.show('Password aggiornata con successo!', 'success')

      await authStore.logout()
      router.push("/login");
      
    } catch (error) {
      toastStore.show('Errore inatteso durante il reset della password', 'danger')
    }
  };
</script>

<template>
    <div class="container">

      <h2>{{ $t('accessWords.newPasswordTitle') }}</h2>
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
          <label for="confirmPassword">{{ $t('accessWords.confirmPassword') }}</label>
        </div>

        <button type="submit" class="btn btn-primary">{{ $t('accessWords.newPasswordAction') }}</button>
      </form>
    </div>
</template>

  
