import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import { useOrder } from "@/stores/order";

export const generateLabelPDF = () => {
    const canvas = document.createElement("canvas");
    const orderStore = useOrder()
    const doc = new jsPDF();

    JsBarcode(canvas, orderStore.item.barcodeValue, { format: "CODE128" });
  
    // Ottieni l'immagine base64 del codice a barre
    const barcodeImage = canvas.toDataURL("image/png");

    // Imposta il font e la dimensione
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Aggiungi il contenuto del PDF (esempio)
    doc.setFontSize(16);
    doc.text("RECIBE: " + orderStore.item.name + " " + orderStore.item.surname, 20, 30);
    doc.text("DIRECCION: " + orderStore.item.address, 20, 40);
    doc.text("PROVINCIA: " + orderStore.item.province, 20, 50);
    doc.text("CIUDAD: " + orderStore.item.city, 20, 60);
    doc.text("TELEFONO: " + orderStore.item.phoneNumber, 20, 70);
    doc.addImage(barcodeImage, "PNG", 100, 30, 100, 20);

    // Modifica altre caratteristiche come il bordo o la disposizione
    doc.setDrawColor(0, 0, 0); // Imposta il colore del bordo (rosso)
    doc.rect(5, 5, 200, 287); // Aggiungi un bordo attorno al documento

    // Salva il PDF
    doc.save(`${orderStore.item.barcodeValue}.pdf`);
}