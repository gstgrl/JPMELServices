import { defineStore } from "pinia";
import { supabase } from "@/services/supabase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    session: null,
    errorMessage: null,
    isLogged: false,
    isLoading: true
  }),
  actions: {
    async init() {
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user || null
      this.isLoading = false
  
      // ascolta eventuali cambiamenti (es. logout automatico o nuovo login)
      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user || null
        this.session = session
        this.isLogged = !!session
      })
    },

    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    
      if (error) {
        this.errorMessage = error
        this.isLogged = false
        this.isLoading = false
        return false

      } else {
        this.user = data.user
        this.session = data.session
        return true
      }
    },

    async logout() {
      const {data, error} = await supabase.auth.signOut()

      if (error) {
        console.error('Errore durante il logout:', error.message)
        this.errorMessage = error
        return false

      } else {
        console.log('Logout eseguito con successo')
        this.errorMessage = null
        this.user = null
        this.session = null
        this.isLogged = false
        return true
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user  
  }
});
