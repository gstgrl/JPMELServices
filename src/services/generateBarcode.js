export function generateNumericBarcode() {
    const timestamp = Date.now().toString().slice(-8); // Prendi solo gli ultimi 8 numeri del timestamp
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Genera un numero random a 4 cifre
    return `99${timestamp}${randomDigits}`; // Esempio: 991530482374
}

