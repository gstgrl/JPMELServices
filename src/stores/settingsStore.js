import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // Identificativo cliente
    clientId: '',

    // Branding
    businessName: '',
    businessDescription: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',

    // Layout UI
    layout: 'default', // es. 'default', 'boxed', 'wide'
    theme: 'light',    // es. 'light' o 'dark'

    // Localizzazione
    language: 'it',
    timezone: 'Europe/Rome',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',

    // Dati contatto
    phone: '',
    email: '',
    address: '',

    // Social & link utili
    facebookUrl: '',
    instagramUrl: '',
    websiteUrl: '',

    // Orari attività
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },

    // Preferenze utente/cliente
    showNewsletter: true,
    enableBooking: true,
    enablePayments: false,
    customMessages: {
      welcome: '',
      successBooking: '',
      errorGeneric: ''
    }
  }),

  actions: {
    fetchSettings() {

        //Richiamo da database i settaggi, li applico allo store
        //Richiamo applyStyles per apportare le modifiche al css
        this.applyStyles()
    },

    // Modifica le variabili CSS globali dinamicamente
    applyStyles() {
        document.documentElement.style.setProperty('--primary-color', this.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', this.secondaryColor);
        document.documentElement.style.setProperty('--color-text', this.primaryColor);
        document.documentElement.style.setProperty('--font-family', this.fontFamily);
        document.documentElement.style.setProperty('--font-size', this.fontSize);
        document.documentElement.style.setProperty('--border-radius', this.borderRadius);
        document.documentElement.style.setProperty('--padding', this.padding);
        document.documentElement.style.setProperty('--margin', this.margin);
    },

    //Modifica le variabili all'interno del pinia, modifiche effettuate dall'utente che utilizza il servizio.
    setSetting() {

    },

    resetSettings() {
      this.$reset();  // Resetta lo store a quello definito nella state iniziale
    }
  }
})
