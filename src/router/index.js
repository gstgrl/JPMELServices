import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import { watch } from 'vue';


import LoginView from '@/views/login/LoginView.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';
import CreateUser from '@/views/creating_user/CreateUser.vue';
import OrderCreationView from '@/views/creating_order/OrderCreationView.vue';
import PalletClosureView from '@/views/closure_pallet/PalletClosureView.vue';
import WareHouseView from '@/views/warehouse/WareHouseView.vue';
import OrderDeliveryManagmentView from '@/views/delivery_view/OrderDeliveryManagmentView.vue';
import forgotPassword from '@/views/login/forgotPassword.vue';
import resetPassword from '@/views/login/resetPassword.vue';


const routes = [
  {path: '/login', component: LoginView},
  {path: '/forgot', component: forgotPassword},
  {path: '/reset-password', component: resetPassword},
  {path: "/dashboard", component: Dashboard, meta: { requiresAuth: true}},
  {path: "/createUser", component: CreateUser, meta: { requiresAuth: true}},
  {path: "/newOrder", component: OrderCreationView, meta: { requiresAuth: true}},
  {path: "/closePallet", component: PalletClosureView, meta: { requiresAuth: true}},
  {path: "/warehouse", component: WareHouseView, meta: { requiresAuth: true}},
  {path: "/delivery", component: OrderDeliveryManagmentView, meta: { requiresAuth: true}},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protezione delle rotte
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Aspetta che il controllo dell'autenticazione sia completato
  if (authStore.loading) {
    const unwatch = watch(
      () => authStore.loading,
      (newVal) => {
        if (!newVal) {
          unwatch();
          proceed();
        }
      }
    );
  } else {
    proceed();
  }

  function proceed() {
    if (to.meta.requiresAuth && !authStore.user) {
      // Se la route richiede autenticazione ma l'utente non è loggato, vai al login
      next("/login");
    } else if (authStore.user && to.path === "/login") {
      // Se l'utente è già loggato e cerca di andare al login, reindirizzalo alla dashboard
      next("/dashboard");
    } else {
      // Se tutto è ok, permetti la navigazione
      next();
    }
  }
});

export default router
