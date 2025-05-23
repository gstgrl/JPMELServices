export default {
  //titoli del menu secondario
  navbar: {
    newOrder: "NUOVO ORDINE",
    newPallet: "NUOVO BANCALE",
    warehouse: "MAGAZZINO",
    settings: "IMPOSTAZIONI",
    settingsLabels: {
      createNewUser: "Creazione utente"
    }
  },
  accessWords: {
    login: "Accedi",
    logout: "Esci",
    signin: "Registrati",
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
    buttons: {
      generateBarCode: "Genera codice a barre",
      saveOrder: "Salva Ordine"
    }
  },
  palletClosure: {
    placholderInput: "Scansiona o inserisci il Barcode",
    closureButton: "Chiudi Bancale"
  },
  warehouse: {
    selectedOrder: "Ordini selezionati",
    unloadDate: "Scaricato in data",
    orderAvilable: "Ordini presenti",
    barcodeText: "Codice a Barre",
    buttons: {
      deliveryButton: "Vai in Consegna"
    }
  },
  delivery: {
    titles: {
      orderToDeliver: "Ordini da consegnare",
      orderDelivered: "Ordini consegnati"
    },
    badgeStates: {
      delivered: "Consegnato",
      pending: "In attesa",
      rescheduled: "Riprogrammato",
      canceled: "Annullata"
    },
    buttons: {
      signatureButton: "Firma per consegna",
      rescheduleButton: "Riprogramma consegna"
    }
  }
}
  