import { usePalletStore } from "@/stores/palletStore";
import { v4 as uuidv4 } from 'uuid'; // Per generare un ID univoco
import { db } from "@/services/firebase";
import { collection, doc, setDoc } from 'firebase/firestore';
import QRCode from 'qrcode'; // Importa la libreria qrcode



export const generateQRCodeAndSave = async (barcodes) => {
    const uuidQricode = uuidv4()

    try {
        // Creazione di un oggetto con i dati del bancale e dei codici a barre
        console.log(barcodes)
        const palletData = {
            barcodes: barcodes,
            createdAt: new Date().toISOString(),
        };

        // Salvataggio dei dati in Firebase
        const palletRef = doc(collection(db, 'pallets'), uuidQricode);
        await setDoc(palletRef, palletData);

        // Generazione del QR Code come immagine usando la libreria `qrcode`
        QRCode.toDataURL(uuidQricode, { width: 200 }, (err, url) => {
            if (err) {
                console.error('Errore nella generazione del QR Code:', err);
                return;
            }
            
            console.log('QR Code immagine:', url);
            // Puoi usare `url` per salvare l'immagine in Firebase o per scaricarla
            const link = document.createElement('a');
            link.href = url;
            link.download = 'pallet-qrcode.png';
            link.click();
            alert('QR Code generato e immagine scaricata!');
        });
    } catch (error) {
        console.error('Errore durante il salvataggio:', error);
        alert('Errore durante il salvataggio del bancale.');
    }
};
  