import QRCode from 'qrcode'; // Importa la libreria qrcode
import { supabase } from './supabase';
import { usePallets } from './supabaseFunctions/pallets';
import { useToastStore } from '@/stores/toastStore';


export function generateNumericBarcode() {
    const timestamp = Date.now().toString().slice(-8); // Prendi solo gli ultimi 8 numeri del timestamp
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Genera un numero random a 4 cifre
    return `99${timestamp}${randomDigits}`; // Esempio: 991530482374
}

export async function generateQrCode(palletID) {
  const toastStore = useToastStore()
  const pallets = usePallets()

  let dataUrl = null
  let fileName = null

  try {
    dataUrl = await QRCode.toDataURL(palletID, { width: 200 })

    const blob = await (await fetch(dataUrl)).blob()
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, "-")
    fileName = `pallet-${timestamp}.png`

    // Upload su Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('palletqrcodes')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) {
      toastStore.show('Errore durante upload immagine QR', 'danger')
      throw uploadError
    }

    // Recupera URL pubblico
    const { data: publicUrlData } = supabase
      .storage
      .from('palletqrcodes')
      .getPublicUrl(fileName)

    if (!publicUrlData || !publicUrlData.publicUrl) {
      toastStore.show('Errore nel recupero del public URL', 'danger')
      throw new Error('Public URL non disponibile')
    }

    const qrCodeImg = publicUrlData.publicUrl

    const { error: palletError } = await pallets.updatePallet(palletID, {
      qrCodeImage: qrCodeImg,
    })

    if (palletError) {
      toastStore.show('Errore aggiornando il pallet', 'danger')
      throw palletError
    }

    toastStore.show('QR Code generato e salvato correttamente!', 'success')
  } catch (error) {
    console.error('Errore nella generazione del QR:', error)
    toastStore.show('Errore nella generazione o salvataggio QR', 'danger')
  } finally {
    // Salva l'immagine localmente solo se è stata generata
    if (dataUrl && fileName) {
      downloadImage(dataUrl, fileName)
    }
  }
}


// 📦 Salva localmente l'immagine
function downloadImage(dataUrl, fileName) {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName
    link.click()
}
