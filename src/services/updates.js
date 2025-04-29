// src/stores/orderStore.js
import { db } from "@/services/firebase";
import { doc, increment, updateDoc, arrayUnion } from "firebase/firestore";


export async function updateOrder(barcode, newStatus = null, incrementRate = null, palletId = null, deliveryStatus = null, signature = null) {
    const orderRef = doc(db, "packages", barcode);
    const newStatusEntry = { date: new Date().toISOString(), status: newStatus };
    const updateData = {}

    if(newStatus) {updateData.statusHistory = arrayUnion(newStatusEntry)}

    if(incrementRate) {updateData.statusCount = increment(incrementRate)}

    if(palletId) {updateData.palletId = palletId}

    if(deliveryStatus) {updateData.deliveryStatus = deliveryStatus}

    if(signature) {updateData.signature = signature}

    try {
        await updateDoc(orderRef, updateData)
        console.log("Documento aggiornato correttamente !")
    } catch (error) {
        console.error("Errore nell'aggiornamento dello stato dell'articolo: ", error)
    }
}