<script setup>
    import { useRouter } from "vue-router";
    import languageSwitch from "../ui/languageSwitch.vue";


    //Pinia Stores
    import { useAuthStore } from "@/stores/auth";
    import { useOrderStore } from "@/stores/orderStore";
    import { useWareHouseStore } from "@/stores/warehouseStore";
    import { useDeliveryPool } from "@/stores/deliveryPoolStore";
    import { usePalletStore } from "@/stores/palletStore";

    const authStore = useAuthStore();
    const orderStore = useOrderStore()
    const warehouseStore = useWareHouseStore()
    const deliveryPoolStore = useDeliveryPool()
    const palletStore = usePalletStore()

    const router = useRouter();

    // Funzione per il logout
    const logout = async () => {
        await authStore.logout()
        
        orderStore.resetOrder()
        warehouseStore.resetPinia()
        deliveryPoolStore.resetPinia()
        palletStore.resetPalletStore()

        router.push('/login');
    }
</script>

<template>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenu">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">{{ $t('navbar.settings') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div class="offcanvas-body">
            <ul class="list-group">
                <li class="list-group-item"><RouterLink to="/createUser" class="nav-link nav-link-page"><h6>{{ $t('navbar.settingsLabels.createNewUser') }}</h6></RouterLink></li>
            </ul>

            <div class="bottom-button"><!-- Logout solo se loggato -->
                <languageSwitch />
                <button type="button" class="btn btn-danger" @click="logout" data-bs-dismiss="offcanvas">{{ $t('accessWords.logout') }}</button>
            </div>
            

        </div>
    </div>
</template>

<style scoped>
    .offcanvas-body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .bottom-button {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .btn {
        height: fit-content;
    }
</style>