import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

export async function generaEtichettePDF(codice, mittente, destinatario, indirizzo, provincia, citta, telefono, totaleColli) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [159, 104]
  });
  

  // Configurazione stili aggiornata
  const styles = {
    titolo: { size: 16, style: 'bold' },
    etichetta: { size: 12, style: 'bold' },
    collo: { size: 12, style: 'normal' },
    campo: { size: 10, style: 'bold' },
    valore: { size: 10, style: 'normal' },
    barcodeText: { size: 5, style: 'normal' },
    barcode: { x: 95, y: 5, w: 60, h: 20 } // Spostato a destra
  };

  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);

  try {
    JsBarcode(canvas, codice, {
      format: "CODE128",
      width: 1.5, // Larghezza ridotta
      height: 25, // Altezza aumentata
      displayValue: false, // Niente testo automatico
      margin: 6
    });

    const barcodeData = canvas.toDataURL('image/png');

    for (let i = 1; i <= totaleColli; i++) {
      if (i > 1) doc.addPage([159, 104], 'landscape');

      // Intestazione
      doc.setFontSize(styles.titolo.size);
      doc.setFont('helvetica', styles.titolo.style);
      doc.text('SPEDIZIONE', 20, 20);

      // Linea divisoria
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.line(20, 28, 140, 28);

      // Dettagli spedizione (sinistra)
      doc.setFont('helvetica', styles.etichetta.style);
      doc.setFontSize(styles.etichetta.size);
      doc.text('MITTENTE:', 20, 35);
      doc.setFont('helvetica', styles.valore.style);
      doc.text(mittente, 25, 40);

      // Destinatario
      doc.setFont('helvetica', styles.etichetta.style);
      doc.setFontSize(styles.etichetta.size);
      doc.text('DESTINATARIO:', 20, 55);
      doc.setFont('helvetica', styles.valore.style);
      doc.text(destinatario, 25, 62);

      // Indirizzo
      doc.setFontSize(styles.valore.size);
      const indirizzoLines = doc.splitTextToSize(indirizzo, 80);
      doc.text(indirizzoLines, 25, 70);

      // Località e telefono
      doc.text(`${provincia}, ${citta}`, 25, 78);
      if (telefono) doc.text(`Tel: ${telefono}`, 25, 86);

      // CODICE A BARRE (spostato a destra)
      doc.addImage(barcodeData, 'PNG', styles.barcode.x, styles.barcode.y, styles.barcode.w, styles.barcode.h);
      
      // Testo codice piccolo sotto barcode
      doc.setFontSize(styles.barcodeText.size);
      doc.text(codice, styles.barcode.x + styles.barcode.w/2, styles.barcode.y + styles.barcode.h, { align: 'center' });

      // Colli in basso a destra
      doc.setFontSize(styles.collo.size);
      doc.setFont('helvetica', styles.collo.style);
      doc.text(`Collo ${i}/${totaleColli}`, 140, 95, { align: 'right' });

      // Data
      doc.setFontSize(8);
      doc.text(`${new Date().toLocaleDateString('it-IT')}`, 25, 100, { align: 'right' });
    }

    doc.save(`Etichette_${codice}.pdf`);
  } catch (error) {
    console.error('Errore:', error);
  } finally {
    canvas.remove();
  }
}