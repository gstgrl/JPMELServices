<script setup>
    import { RouterLink, useRouter } from "vue-router";
    import { onMounted } from "vue";
    import { useAuthStore } from "@/stores/auth";
    import { useOrderStore } from "@/stores/orderStore";
    import { useDeviceStore } from "@/stores/diveceStore";

    const authStore = useAuthStore();
    const orderStore = useOrderStore()
    const deviceStore = useDeviceStore()
    const router = useRouter();

    onMounted(() => {
        // Verifica se l'utente è loggato all'inizio
        authStore.checkAuth();
    });

    // Funzione per il logout
    const logout = async () => {
        await authStore.logout()
        orderStore.resetOrder()
        router.push('/login');
    }
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
                    <ul class="navbar-nav bottom-bar" v-if="!deviceStore.isMobile">

                        <li class="nav-item">
                            <RouterLink to="/newOrder" class="nav-link"><h6>NUOVO ORDINE</h6></RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink to="/closePallet" class="nav-link"><h6>NUOVO BANCALE</h6></RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink to="/warehouse" class="nav-link"><h6>MAGAZZINO</h6></RouterLink>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">OPERAZIONI TECNICHE</a>
                            <ul class="dropdown-menu">
                                <li><RouterLink to="/createUser" class="nav-link">Creazione utente</RouterLink></li>
                            </ul>
                        </li>
                    </ul>

                    <ul class="navbar-nav bottom-bar" v-else>

                        <li class="nav-item">
                            <RouterLink to="/newOrder" class="nav-link"><font-awesome-icon :icon="['fas', 'box']" class="fa-xl"/></RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink to="/closePallet" class="nav-link"><font-awesome-icon :icon="['fas', 'pallet']" class="fa-xl"/></RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink to="/scanArrivedPallet" class="nav-link"><font-awesome-icon :icon="['fas', 'warehouse']"/></RouterLink>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><font-awesome-icon :icon="['fas', 'gear']" /></a>
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