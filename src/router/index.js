import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import { watch } from 'vue';

//Login Views
import LoginView from '@/views/login/LoginView.vue';
import forgotPassword from '@/views/login/forgotPassword.vue';
import resetPassword from '@/views/login/resetPassword.vue';

//Managment Views
import Dashboard from '@/views/dashboard/Dashboard.vue';
import ordersView from '@/views/control_view/orders_view/ordersView.vue';
import palletView from '@/views/control_view/pallets_view/palletView.vue';

import CreateUser from '@/views/creating_user/CreateUser.vue';
import newPassword from '@/views/creating_user/newPassword.vue';

import OrderCreationView from '@/views/creating_order/OrderCreationView.vue';
import PalletClosureView from '@/views/closure_pallet/PalletClosureView.vue';
import WareHouseView from '@/views/warehouse/WareHouseView.vue';
import OrderDeliveryManagmentView from '@/views/delivery_view/OrderDeliveryManagmentView.vue';
import CustomerView from '@/views/customer/CustomerView.vue';


const routes = [
  {path: '/customer', component: CustomerView, meta: { hideNavbar: true}},

  {path: '/login', component: LoginView, meta: { hideNavbar: false}},
  {path: '/forgot', component: forgotPassword, meta: { hideNavbar: false}},
  {path: '/reset-password', component: resetPassword, meta: { hideNavbar: true}},

  {path: "/dashboard", component: Dashboard, meta: { requiresAuth: true, hideNavbar: false}},
  {path: '/orders', component: ordersView, meta: { requiresAuth: true, hideNavbar: false}},
  {path: '/pallets', component: palletView, meta: { requiresAuth: true, hideNavbar: false}},

  {path: "/createUser", component: CreateUser, meta: { requiresAuth: true, hideNavbar: false}},
  {path: "/add-password", component: newPassword, meta: { requiresAuth: true, hideNavbar: false}},

  {path: "/newOrder", component: OrderCreationView, meta: { requiresAuth: true, hideNavbar: false}},
  {path: "/closePallet", component: PalletClosureView, meta: { requiresAuth: true, hideNavbar: false}},
  {path: "/warehouse", component: WareHouseView, meta: { requiresAuth: true, hideNavbar: false}},
  {path: "/delivery", component: OrderDeliveryManagmentView, meta: { requiresAuth: true, hideNavbar: false}},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protezione delle rotte
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Aspetta che il controllo dell'autenticazione sia completato
  if (authStore.isLoading) {
    const unwatch = watch(
      () => authStore.isLoading,
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
    if (to.meta.requiresAuth && !authStore.user && !authStore.isRecovering) {
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
