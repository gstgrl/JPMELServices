import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import { watch } from 'vue';

import CreateUser from '@/views/CreateUser.vue';
import LoginView from '@/views/LoginView.vue';
import CreatePallet from '@/views/CreatePallet.vue';
import Dashboard from '@/views/Dashboard.vue';
import GenerateLabel from '@/views/GenerateLabel.vue';


const routes = [
  {path: '/login', component: LoginView},
  {path: "/dashboard", component: Dashboard, meta: { requiresAuth: true}},
  {path: "/createUser", component: CreateUser, meta: { requiresAuth: true}},
  {path: "/createPallet", component: CreatePallet, meta: { requiresAuth: true}},
  {path: "/generateLabel", component: GenerateLabel, meta: { requiresAuth: true}},
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
