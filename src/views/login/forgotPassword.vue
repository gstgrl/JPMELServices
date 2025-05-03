<script setup>
    import { ref } from "vue";
    import { supabase } from "@/services/supabase"; // Assicurati che questo punto venga configurato correttamente

    const email = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");

    const sendResetLink = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    const { error } = await supabase.auth.resetPasswordForEmail(email.value);

        if (error) {
            errorMessage.value = error.message;
        } else {
            successMessage.value = "Controlla la tua email per il link di reset!";
        }
    };
</script>

<template>
    <div class="container">

        <div class="alert alert-danger mt-3" role="alert" v-if="errorMessage">
            {{ errorMessage }}
        </div>

        <div class="alert alert-success mt-3" role="alert" v-if="successMessage">
            {{ successMessage }}
        </div>

        <h2>Recupero Password</h2>
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
            <button type="submit" class="btn btn-primary">Invia link di reset</button>
        </form>
    </div>
</template>
  