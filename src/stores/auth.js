import { defineStore } from "pinia";
import { auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "@/services/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: true,
    isLoggedIn: false
  }),
  actions: {
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;

        this.isLoggedIn = true

        localStorage.setItem("token", await this.user.getIdToken());
      } catch (error) {
        console.error("Errore di login:", error);
      }
    },
    async logout() {
      await signOut(auth);
      this.user = null;
      this.isLoggedIn = false
      localStorage.removeItem("token");
    },
    checkAuth() {

      onAuthStateChanged(auth, async (user) => {
        this.user = user;
        this.loading = false;
        if (user) {
          this.isLoggedIn = true
        }else {
          this.isLoggedIn = false
        }
      });
    }
  }
});
