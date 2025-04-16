import { defineStore } from "pinia";
import { getDoc, doc, updateDoc, where, query, getDocs, collection } from "firebase/firestore";

import { db } from "@/services/firebase";
import { useOrderStore } from "./orderStore";

export const useWareHouseStore = defineStore("wareHouse", {
  state: () => ({
    warehouseOrders: [],
    alreadyCharged: false
  }),
  actions: {
    //Funzione che ritorna il documento da Firebase con il palletId corrispondente facendo un controllo sulla validità del palletStatus
    //Utilizzata quando si scansiona un qr-code per immettere gli ordini nel magazzino 
    async dischargPalletById(palletId) {     
        try {
            const palletRef = doc(db, "pallets", palletId);
            const palletDoc = await getDoc(palletRef); // Ottieni il documento
        
            if (palletDoc.exists()) {
                const data = palletDoc.data()
                const orderStore = useOrderStore()

                if(data.palletStatus === "Closed") {

                    const orders = await Promise.all(
                        data.barcodes.map(async (barcode) => {
                            const found = await orderStore.fetchOrderByBarcode(barcode, 2);
                            
                            if (found) {
                                const order = {data: orderStore.order, barcode: barcode} //Effettuo una copia dell'ordine estratto dal DB prima di resettare il pinia Store
                                await orderStore.updateStatusHistory(barcode, "Arrived in the Dominican Republic", null);
                                orderStore.resetOrder()
                                return order; // Copia indipendente dei dati
                            }

                            console.warn(`⚠️ Ordine non trovato per il barcode: ${barcode}`);
                            return null; // Se non trova l'ordine, restituisce null
                        })
                    );
                    
                    // Filtra eventuali ordini nulli e li aggiunge al magazzino
                    const ordersFiltered = orders.filter(order => order !== null)

                    if(ordersFiltered.length > 0) {
                        this.warehouseOrders.push({
                            dischargedAt: new Date().toISOString(),
                            orders: ordersFiltered,
                            palletId: palletId
                        })    
                    }

                    await this.updatePalletStatus("Discharged", palletRef)
                }
            } else {
                window.alert("Nessun bancale trovato!");
                return false
            }
        } catch (error) {
            console.error("Errore nel recupero del documento:", error);
            return false
        }
    },

    //Funzione che carica tutti i bancali gia scaricati nella pagina durante il primo login
    async feetchPalletDischarged() {
        try {
            const palletRef = query( collection(db, "pallets"), where("palletStatus", "==", "Discharged"));
            const palletDocs = await getDocs(palletRef); // Ottieni il documento
        
            if (!palletDocs.empty) {
                const orderStore = useOrderStore();
    
                for (const doc of palletDocs.docs) {
                    const data = doc.data();
                    const palletId = doc.id;
    
                    const orders = await Promise.all(
                        data.barcodes.map(async (barcode) => {
                            const found = await orderStore.fetchOrderByBarcode(barcode, 3);
                            if (found) {
                                const order = { data: orderStore.order, barcode: barcode };
                                orderStore.resetOrder();
                                return order;
                            }
                            console.warn(`⚠️ Ordine non trovato per il barcode: ${barcode}`);
                            return null;
                        })
                    );
    
                    const ordersFiltered = orders.filter(order => order !== null);
    
                    if (ordersFiltered.length > 0) {
                        this.warehouseOrders.push({
                            dischargedAt: new Date().toISOString(),
                            orders: ordersFiltered,
                            palletId: palletId
                        });
                    }
                }

                this.alreadyCharged = true
            } else {
                window.alert("Nessun bancale trovato!");
                return false;
            }
        } catch (error) {
            console.error("Errore nel recupero del documento:", error);
            return false
        }
    },

    async updatePalletStatus(newStatus, palletRef) {
        try {
            await updateDoc(palletRef, {palletStatus: newStatus})
            console.log("Documento aggiornato correttamente !")
        } catch (error) {
            console.error("Errore nell'aggiornamento dello stato dell'articolo: ", error)
        }
    },

    resetWarehouseStore() {
        this.warehouseOrders = [],
        this.alreadyCharged = false
    }
  },
});
