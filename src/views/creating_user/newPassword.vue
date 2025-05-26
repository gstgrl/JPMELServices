<script setup>
    import { ref } from "vue";
    import { supabase } from "@/services/supabase";
    import { useToastStore } from "@/stores/toastStore";
    import { useRouter } from "vue-router";

    const toastStore = useToastStore()
    const router = useRouter()
    const password = ref("")
    const passwordConfirmation = ref("")

    const confirmPassword = async () => {
        if(password.value !== passwordConfirmation.value) {
            toastStore.show('Le password non coincidono', 'warning')
            return
        }

        const { data, error } = await supabase.auth.updateUser({password: password.value})      
        if(error)  {
            toastStore.show('Error during updating password', 'danger')
            throw new Error(`Error during updating password: ${error.message}`)
        }

        password.value = ''
        passwordConfirmation.value = ''
        toastStore.show('Password aggiornate correttamente', 'success')
        router.push('/dashboard')

    };
</script>

<template>
    <div class="container mt-5">
      <h2>{{ $t('accessWords.newPasswordTitle') }}</h2>
      <form @submit.prevent="confirmPassword">
        <div class="form-floating mb-3">
            <input type="password" class="form-control" id="password" placeholder="password" v-model="password">
            <label for="password">Password</label>
        </div>

        <div class="form-floating mb-3">
            <input type="password" class="form-control" id="confirm-password" placeholder="confirm password" v-model="passwordConfirmation">
            <label for="confirm-password">{{ $t('accessWords.confirmPassword') }}</label>
        </div>
  
        <button type="submit" class="btn btn-primary">{{ $t('accessWords.newPasswordAction') }}</button>
      </form>
    </div>
</template>