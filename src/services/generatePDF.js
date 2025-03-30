import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";

export const generateLabelPDF = (name, surname, address, province, city, phoneNumber, barcode) => {
    const canvas = document.createElement("canvas");
    const doc = new jsPDF();

    JsBarcode(canvas, barcode, { format: "CODE128" });
  
    // Ottieni l'immagine base64 del codice a barre
    const barcodeImage = canvas.toDataURL("image/png");

    // Imposta il font e la dimensione
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Aggiungi il contenuto del PDF (esempio)
    doc.setFontSize(16);
    doc.text("RECIBE: " + name + " " + surname, 20, 30);
    doc.text("DIRECCION: " + address, 20, 40);
    doc.text("PROVINCIA: " + province, 20, 50);
    doc.text("CIUDAD: " + city, 20, 60);
    doc.text("TELEFONO: " + phoneNumber, 20, 70);
    doc.addImage(barcodeImage, "PNG", 100, 30, 100, 20);

    // Modifica altre caratteristiche come il bordo o la disposizione
    doc.setDrawColor(0, 0, 0); // Imposta il colore del bordo (rosso)
    doc.rect(5, 5, 200, 287); // Aggiungi un bordo attorno al documento

    // Salva il PDF
    doc.save(`${barcode}.pdf`);
}