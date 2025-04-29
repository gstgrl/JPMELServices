<script setup>
    import { RouterLink } from "vue-router";
    import { onMounted } from "vue";
    import offcanva from "./offcanva.vue";


    //Pinia Stores
    import { useAuthStore } from "@/stores/auth";
    import { useDeliveryPool } from "@/stores/deliveryPoolStore";

    const authStore = useAuthStore();
    const deliveryPoolStore = useDeliveryPool()

    onMounted(() => {
        // Verifica se l'utente è loggato all'inizio
        authStore.checkAuth();
    });

</script>

<template>
    <!-- Navbar principale -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" :to="authStore.isLoggedIn ? '/dashboard' : '/login'">
          JP MEL Services
        </RouterLink>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
  
        <!-- Toggler sempre visibile per aprire Offcanvas -->
        <button class="btn btn-outline-light ms-auto me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu" aria-controls="offcanvasMenu"  v-if="authStore.isLoggedIn">
            <font-awesome-icon :icon="['fas', 'gear']" />
        </button>
      </div>
    </nav>
  
    <!-- Navbar secondaria per utenti loggati -->
    <nav v-if="authStore.isLoggedIn" class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <!-- Desktop view -->
          <div class="navbar-nav unhidden-bottom-bar d-none d-lg-flex">
              <div class="bottom-bar-links" v-if="!deliveryPoolStore.onDelivery">
                <RouterLink to="/newOrder" class="nav-link"><h6>{{ $t('navbar.newOrder') }}</h6></RouterLink>
                <RouterLink to="/closePallet" class="nav-link"><h6>{{ $t('navbar.newPallet') }}</h6></RouterLink>
                <RouterLink to="/warehouse" class="nav-link" ><h6>{{ $t('navbar.warehouse') }}</h6></RouterLink>
              </div>

              <div class="bottom-bar-links" v-else>
                <RouterLink to="/newOrder" class="nav-link"><h6>{{ $t('navbar.newOrder') }}</h6></RouterLink>
                <RouterLink to="/closePallet" class="nav-link"><h6>{{ $t('navbar.newPallet') }}</h6></RouterLink>
                <RouterLink to="/delivery" class="nav-link"><h6>DELIVERY MANAGER</h6></RouterLink>
              </div>
          </div>
  
          <!-- Mobile view -->
          <div class="navbar-nav bottom-bar d-flex d-lg-none">
              <div class="bottom-bar-links" v-if="!deliveryPoolStore.onDelivery">
                <RouterLink to="/newOrder" class="nav-link nav-link-page"><font-awesome-icon :icon="['fas', 'box']" class="fa-xl" /></RouterLink>
                <RouterLink to="/closePallet" class="nav-link nav-link-page"><font-awesome-icon :icon="['fas', 'pallet']" class="fa-xl" /></RouterLink>
                <RouterLink to="/warehouse" class="nav-link nav-link-page"><font-awesome-icon :icon="['fas', 'warehouse']" /></RouterLink>
              </div>
              
              <div class="bottom-bar-links" v-else>
                <RouterLink to="/newOrder" class="nav-link nav-link-page"><font-awesome-icon :icon="['fas', 'box']" class="fa-xl" /></RouterLink>
                <RouterLink to="/closePallet" class="nav-link nav-link-page"><font-awesome-icon :icon="['fas', 'pallet']" class="fa-xl" /></RouterLink>
                <RouterLink to="/delivery" class="nav-link nav-link-page"><font-awesome-icon :icon="['fas', 'truck']" class="fa-xl" /></RouterLink>
              </div>
          </div>
        </div>
      </div>
    </nav>
  
    <!-- Offcanvas component -->
    <offcanva />
</template>

<style scoped>
    h6 {
    margin-right: 0.8rem;
    }

    .unhidden-bottom-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    }

    .bottom-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    }

    .bottom-bar-links {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-grow: 1;
    }

    .nav-link-page {
    padding: 0.5rem;
    }

    @media (min-width: 992px) {
    .btn-danger {
        margin-left: auto;
    }
    }

    @media (max-width: 991px) {
    .btn-danger {
        margin-top: 0.5rem;
    }
    }
</style>