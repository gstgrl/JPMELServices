import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function generateNumericBarcode() {
    const timestamp = Date.now().toString().slice(-8); // Prendi solo gli ultimi 8 numeri del timestamp
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Genera un numero random a 4 cifre
    return `99${timestamp}${randomDigits}`; // Esempio: 991530482374
}

export async function generateAndSaveBarcode() {
    let isUnique = false;
    let barcode;

    while (!isUnique) {
        barcode = generateNumericBarcode(); // Funzione definita sopra

        // Controllo se esiste già nel database
        const q = query(collection(db, "packages"), where("barcode", "==", barcode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            isUnique = true;
        }
    }
    
    return barcode;
}
