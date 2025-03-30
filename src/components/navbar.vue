<script setup>
    import { RouterLink, useRouter } from "vue-router";
    import { onMounted } from "vue";
    import { useAuthStore } from "@/stores/auth";
    import { usePalletStore } from "@/stores/palletStore";
    import { useOrder } from "@/stores/order";

    const authStore = useAuthStore();
    const palletStore = usePalletStore();
    const orderStore = useOrder();

    onMounted(() => {
        // Verifica se l'utente è loggato all'inizio
        authStore.checkAuth();
    });

    // Funzione per il logout
    const logout = async () => {
        await authStore.logout()
        palletStore.resetPallet()
        orderStore.resetOrder()
        router.push('/login');
    }

    const router = useRouter();
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" :to="authStore.isLoggedIn ? '/dashboard' : '/login'">JP MEL Services</RouterLink>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <button type="button" class="btn btn-danger collapse navbar-collapse" id="navbarNavAltMarkup" @click="logout"  v-if="authStore.isLoggedIn">Logout</button>
        </div>
    </nav>

    <nav class="navbar navbar-expand-lg bg-body-tertiary bottom-bar"  v-if="authStore.isLoggedIn">
        <div class="container-fluid">
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <ul class="navbar-nav bottom-bar">

                        <li class="nav-item">
                            <RouterLink to="/generateLabel" class="nav-link"><h6>NUOVO ORDINE</h6></RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink to="/createPallet" class="nav-link"><h6>NUOVO BANCALE</h6></RouterLink>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">OPERAZIONI TECNICHE</a>
                            <ul class="dropdown-menu">
                                <li><RouterLink to="/createUser" class="nav-link">Creazione utente</RouterLink></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
    .navbar {
        display: flex;
        flex-direction: column;
    }

    .main-bar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        width: 100%;
    }

    .bottom-bar {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: fit-content;
    }

    @media (min-width: 992px) {
        .btn-danger {
            flex-grow: 0;
        }
    }

    @media (max-width: 991px) {
        .btn-danger {
            margin-top: 0.5rem;
        }
    }
</style>