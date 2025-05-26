<script setup>
    import { ref } from "vue";
    import { supabase } from "@/services/supabase"; // Assicurati che questo punto venga configurato correttamente
    import { useAuthStore } from "@/stores/auth";

    const email = ref("");
    const authStore = useAuthStore()

    const sendResetLink = async () => {
        errorMessage.value = "";
        successMessage.value = "";

        const { error } = await supabase.auth.resetPasswordForEmail(email.value, { redirectTo: 'https://jpmelservices.netlify.app/reset-password'});
        if(error)  {
            toastStore.show('Error during resetting user password', 'danger')
            throw new Error(`Error during resetting user password: ${error.message}`)
        }
        
        authStore.isRecovering = true
        email.value = ''
        toastStore.show('Controlla la tua email per il link di reset!', 'success')
    };
</script>

<template>
    <div class="container">

        <h2>{{ $t('accessWords.refoundPassword') }}</h2>
        <form @submit.prevent="sendResetLink">
            <div class="form-floating mb-3">
                <input
                    type="text"
                    class="form-control m-1"
                    v-model="email"
                    placeholder="Email"
                    id="email"
                    required
                />
                <label for="email">Email</label>
            </div>
            <button type="submit" class="btn btn-primary">{{ $t('accessWords.sendToRefoundPassword') }}</button>
        </form>
    </div>
</template>
  