import { createApp } from "vue";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Importa alcune icone che vuoi usare
import { faCamera, faXmark, faPallet, faBox, faGear, faWarehouse, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";


// Aggiungi le icone alla libreria globale
library.add(faCamera, faPallet, faXmark, faBox, faGear, faWarehouse, faTrash, faCheckCircle);

const app = createApp(App);

// Crea e configura Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Abilita la persistenza

app.use(pinia); // Pinia va registrata prima di usarla

// Ora puoi usare gli store
const authStore = useAuthStore();
authStore.checkAuth(); // Controlla se l'utente è loggato

// Registra il componente FontAwesome a livello globale
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.mount("#app");

