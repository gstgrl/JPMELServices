import { defineStore } from "pinia";
import { useOrder } from "./order";
import { updateDoc, getDocs, getDoc, collection, query, where, arrayUnion, increment,doc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const usePalletStore = defineStore("pallet", {
  state: () => ({
    pallet: [],
    barcodes: []
  }),
  actions: {
    addOrder(order) {
      const alreadyExist = this.pallet.some(item => item.barcodeValue === order.barcodeValue)

      if(alreadyExist) {
        window.alert("Ordine già presente nel bancale!");
      } else {
        this.pallet.push(order);
        this.barcodes.push(order.barcodeValue)
      }
    },
    async closePallet() {
      for (const barcode of this.barcodes) {
        const q = query(collection(db, "packages"), where("barcodeValue", "==", barcode));
    
        const newStatusEntry = {
          date: new Date().toISOString(),
          status: "Shipped by Sea"
        };
    
        try {
          const querySnapshot = await getDocs(q);
    
          if (querySnapshot.empty) {
            window.alert(`Nessun prodotto trovato con il codice a barre: ${barcode}`);
          } else {
            // Itera sui documenti trovati e aggiorna Firestore
            querySnapshot.forEach(async (docSnapshot) => {
              try {
                await updateDoc(docSnapshot.ref, {
                  statusHystory: arrayUnion(newStatusEntry),
                  statusCount: increment(1)
                });
              } catch (updateError) {
                console.error(`Errore nell'aggiornamento dello stato per ${barcode}:`, updateError);
              }
            });
          }
        } catch (error) {
          console.error(`Errore durante la ricerca del prodotto con barcode ${barcode}:`, error);
        }
      }
    },
    async findOrder(barcode) { //Mi trova l'ordine con il suo rispettivo codice a barre e che sia in Packaging
      const orderStore = useOrder()

      try {
        const docRef = doc(db, "packages", barcode); // Riferimento al documento
        const docSnap = await getDoc(docRef); // Ottieni il documento
    
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.statusCount === 1) {
            orderStore.setOrder(data.name, data.surname, data.address, data.province, data.city, data.phoneNumber, barcode)
            this.addOrder(orderStore.item)
            orderStore.resetOrder()
          }

        } else {
          window.alert("Nessun documento trovato!");
        }
      } catch (error) {
        console.error("Errore nel recupero del documento:", error);
      }
    },
    removeOrder(barcode) {
      this.pallet = this.pallet.filter(item => item.barcodeValue !== barcode)
      this.barcodes =this.barcodes.filter(item => item !== barcode)
    },
    resetPallet() {
      this.pallet = []
      this.barcodes = []
    },
    printPallet() {
      console.log(this.pallet)
    }
  },
  persist: true,
});
