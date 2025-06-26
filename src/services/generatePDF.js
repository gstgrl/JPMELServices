import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";

export async function generaEtichettaA4PDF(codice, mittente, destinatario, indirizzo, provincia, citta, telefono) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Configurazione stili
  const styles = {
    titolo: { size: 24, style: 'bold' },
    etichetta: { size: 14, style: 'bold' },
    campo: { size: 12, style: 'bold' },
    valore: { size: 12, style: 'normal' },
    barcodeText: { size: 10, style: 'normal' },
    barcode: { x: 140, y: 30, w: 60, h: 25 }
  };

  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);

  try {
    JsBarcode(canvas, codice, {
      format: "CODE128",
      width: 1.5,
      height: 30,
      displayValue: false,
      margin: 6
    });

    const barcodeData = canvas.toDataURL('image/png');

    // Intestazione
    doc.setFontSize(styles.titolo.size);
    doc.setFont('helvetica', styles.titolo.style);
    doc.text('DOCUMENTO DI SPEDIZIONE', 105, 20, { align: 'center' });

    // Linea divisoria
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Sezione Mittente (sinistra)
    doc.setFont('helvetica', styles.etichetta.style);
    doc.setFontSize(styles.etichetta.size);
    doc.text('MITTENTE:', 20, 40);
    doc.setFont('helvetica', styles.valore.style);
    doc.text(mittente, 20, 48);

    // Sezione Destinatario (destra)
    doc.setFont('helvetica', styles.etichetta.style);
    doc.setFontSize(styles.etichetta.size);
    doc.text('DESTINATARIO:', 20, 70);
    doc.setFont('helvetica', styles.valore.style);
    doc.text(destinatario, 20, 78);

    // Indirizzo completo
    const indirizzoCompleto = `${indirizzo}, ${provincia}, ${citta}`;
    const indirizzoLines = doc.splitTextToSize(indirizzoCompleto, 100);
    doc.text(indirizzoLines, 20, 86);

    // Telefono (se presente)
    if (telefono) {
      doc.text(`Tel: ${telefono}`, 20, 100);
    }

    // CODICE A BARRE (in alto a destra)
    doc.addImage(barcodeData, 'PNG', styles.barcode.x, styles.barcode.y, styles.barcode.w, styles.barcode.h);
    
    // Testo codice sotto barcode
    doc.setFontSize(styles.barcodeText.size);
    doc.text(`CODICE: ${codice}`, styles.barcode.x + styles.barcode.w/2, styles.barcode.y + styles.barcode.h + 5, { align: 'center' });

    // Linea di separazione in fondo
    doc.line(20, 285, 190, 285);

    doc.save(`Spedizione_${codice}.pdf`);
  } catch (error) {
    console.error('Errore:', error);
  } finally {
    canvas.remove();
  }
}