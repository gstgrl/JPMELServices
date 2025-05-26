export default {
  //titoli del menu secondario
  messages: {
    orderAddedToPallet: "Ordine aggiunto al bancale",
    orderRemovedFromPallet: "Ordine rimosso dal bancale"
  },
  navbar: {
    newOrder: "NUOVO ORDINE",
    newPallet: "NUOVO BANCALE",
    warehouse: "MAGAZZINO",
    settings: "IMPOSTAZIONI",
    delivery: "GESTIONE CONSEGNA",
    settingsLabels: {
      createNewUser: "Creazione utente",
      orderManager: "Gestione Ordini",
      palletManager: "Gestione Bancali"
    }
  },
  accessWords: {
    login: "Accedi",
    logout: "Esci",
    signin: "Registrati",
    emailAdress: "Indirizzo Email",
    askSendAccessLink: "Invia Link di accesso",
    sendLink: "Invia Link",
    newPasswordTitle: "Imposta una nuova password",
    newPasswordAction: "Imposta nuova Password",
    confirmPassword: "Conferma Password",
    refoundPassword: "Recupera Password",
    sendToRefoundPassword: "invia link di reset"
  },
  addressInfo: {
    address: "Indirizzo",
    province: "Provincia",
    city: "Città",
    phoneNumber: "Cellulare",
    zipCode: "CAP",
  },
  orderCreation: {
    title: "Genera etichetta",
    receiver: "Destinatario",
    placeholderNameReciver: "Nome",
    placeholderSurnameReciver: "Cognome",  
    address: "Indirizzo",
    province: "Provincia",
    city: "Città",
    phoneNumber: "Cellulare",
    zipCode: "CAP",
    sender: "Mittente",
    packageNumber: "Colli",
    buttons: {
      generateBarCode: "Genera codice a barre",
      saveOrder: "Salva Ordine",
      saveNewClient: "Salva e Chiudi"
    }
  },
  palletClosure: {
    placholderInput: "Scansiona o inserisci il Barcode",
    createPallet: "Crea Bancale",
    adOrders: "Aggiungi Ordini",
    unduCreation: "Annulla Creazione",
    closureButton: "Chiudi Bancale",
    closeModal: "Chiudi"
  },
  warehouse: {
    selectedOrder: "Ordini selezionati",
    unloadDate: "Scaricato in data",
    orderAvilable: "Ordini in Magazzino",
    barcodeText: "Codice a Barre",
    buttons: {
      deliveryButton: "Vai in Consegna"
    }
  },
  delivery: {
    titles: {
      orderToDeliver: "Ordini da consegnare",
      orderDelivered: "Ordini consegnati",
      orderRescheduled: "Ordini riprogrammati"
    },
    badgeStates: {
      delivered: "Consegnato",
      pending: "In attesa",
      rescheduled: "Riprogrammato",
      canceled: "Annullata"
    },
    buttons: {
      signatureButton: "Firma",
      rescheduleButton: "Riprogramma",
      returnToWarehouse: "Torna in magazzino"
    }
  },
  controlView: {
    orders: {
      badges: {
        processing: "In lavorazione",
        shipped: "Spedito",
        arrived: "Arrivato in Domenicana",
        inDelivery: "In consegna",
        delivered: "Consegnato"
      },
      actions: {
        modifyOrder: "Modifica ordine"
      },
      orderStatus: "Stato dell'ordine"
    }
  }
}
  