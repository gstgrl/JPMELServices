<script setup>
    import { ref } from "vue";
    import { auth, db } from "@/services/firebase";
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import { doc, setDoc } from "firebase/firestore";
    import { useRouter } from "vue-router";

    const name = ref("")
    const email = ref("")
    const password = ref("")
    const role = ref("employee")

    const router = useRouter();

    const registerUser = async () => {
        try {
            // Creazione dell'utente in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            const user = userCredential.user;

            // Salvataggio dei dati dell'utente nel Firestore (nel database)
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: role.value,
                name: name.value
            });

            // Dopo la registrazione, redirigi l'utente alla pagina di login o home
            alert("Utente registrato con successo!");
            router.push("/login"); // Sostituisci con il percorso desiderato
        } catch (error) {
            console.error("Errore durante la registrazione:", error);
            alert("Errore durante la registrazione: " + error.message);
        }
    };
</script>

<template>
    <div class="container mt-5">
      <h2>Registrazione Utente</h2>
      <form @submit.prevent="registerUser">
        <div class="mb-3">
          <label class="form-label">Nome</label>
          <input
            type="text"
            class="form-control"
            v-model="name"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            v-model="email"
            required
          />
        </div>
  
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            v-model="password"
            required
          />
        </div>
  
        <div class="mb-3">
          <label class="form-label">Ruolo</label>
          <select class="form-select" v-model="role" required>
            <option value="operatore">Operatore</option>
            <option value="supervisore">Supervisore</option>
          </select>
        </div>
  
        <button type="submit" class="btn btn-primary">Registrati</button>
      </form>
    </div>
  </template>