import QRCode from 'qrcode'; // Importa la libreria qrcode

export function generateNumericBarcode() {
    const timestamp = Date.now().toString().slice(-8); // Prendi solo gli ultimi 8 numeri del timestamp
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Genera un numero random a 4 cifre
    return `99${timestamp}${randomDigits}`; // Esempio: 991530482374
}

export function generateQrCode(palletID) {
    QRCode.toDataURL(palletID, { width: 200 }, (err, url) => {
        if (err) {
            console.error('Errore nella generazione del QR Code:', err);
            return;
        }

        
        const now = new Date()
        const timestamp = now.toISOString().replace(/[:.]/g, "-") // "2025-05-06T14-30-45-123Z"
        
        // Puoi usare `url` per salvare l'immagine in Firebase o per scaricarla
        const link = document.createElement('a');
        link.href = url;
        link.download = `pallet-${timestamp}.png`;
        link.click();
        alert('QR Code generato e immagine scaricata!');
    })
}
