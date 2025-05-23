<script setup>
    import { ref } from "vue";
    import { supabase } from "@/services/supabase";
    import { useToastStore } from "@/stores/toastStore";

    const toastStore = useToastStore()
    const email = ref("")

    const registerUser = async () => {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.value,
        options: {
          emailRedirectTo: 'https://jpmelservices.netlify.app/add-password'  // dove atterra l’utente dopo il click
        }
      })

      if(error)  {
        toastStore.show('Error during returning order to warehouse', 'danger')
        throw new Error(`Error during returning order to warehouse: ${error.message}`)
      }

      email.value = ''
      toastStore.show(`Email inviata correttamente a ${email.value}`, 'success')
    };
</script>

<template>

    <div class="container mt-5">
      <h2>Invia Link di accesso</h2>
      <form @submit.prevent="registerUser">
        <div class="form-floating mb-3">
            <input type="email" class="form-control" id="floatingInput" placeholder="email" v-model="email">
            <label for="floatingInput">Email address</label>
        </div>
  
        <button type="submit" class="btn btn-primary">Spedisci link</button>
      </form>
    </div>
  </template>